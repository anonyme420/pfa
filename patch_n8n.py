import json, sys, os, argparse

parser = argparse.ArgumentParser()
parser.add_argument("src", help="Path to the workflow JSON file")
parser.add_argument("--backend-url", default="http://host.docker.internal:8000",
                    help="Base URL for backend HTTP nodes (default: http://host.docker.internal:8000)")
args = parser.parse_args()

with open(args.src, encoding="utf-8") as f:
    wf = json.load(f)

BACKEND = args.backend_url.rstrip("/")

# ── New jsCode strings ────────────────────────────────────────────────────────

BUILD_PLANNER_PAYLOAD = r"""
const tripContext = items[0].json.tripContext;
const top3 = (tripContext.recommended_destinations || []).slice(0, 3);
const prefs = tripContext.preferences;

return top3.map(city => ({
  json: {
    tripContext,
    top3_cities: top3,
    script_type: 'weather',
    city_payload: {
      city: city.city_name,
      country: city.country || '',
      days: prefs.trip_duration_days || 7,
      departure_date: prefs.departure_date || '',
    }
  }
}));
"""

COLLECT_ALL_PLANNER_DATA = r"""
const buildItems = $('Build Planner Payload').all();
const cityPayloads = buildItems.map(i => ({
  city:    i.json.city_payload?.city    || '',
  country: i.json.city_payload?.country || '',
}));

const weatherResults = items.map((item, idx) => ({
  city: cityPayloads[idx]?.city
    || item.json.city
    || item.json.weather?.location?.name
    || '',
  country: cityPayloads[idx]?.country
    || item.json.country
    || item.json.weather?.location?.country
    || '',
  weather: item.json,
}));

const tripContext = buildItems[0]?.json?.tripContext || {};
const prefs = tripContext.preferences || {};

const checkIn  = prefs.departure_date || '';
const duration = prefs.trip_duration_days || 7;
const checkOut = checkIn
  ? new Date(new Date(checkIn).getTime() + duration * 86400000)
      .toISOString().split('T')[0]
  : '';

const top3 = (tripContext.recommended_destinations || []).length > 0
  ? tripContext.recommended_destinations.slice(0, 3)
  : weatherResults.map(r => ({ city_name: r.city, country: r.country }));

const batchRequests = [];
for (const city of top3) {
  batchRequests.push({
    type:      'hotels',
    city:      city.city_name,
    country:   city.country || '',
    check_in:  checkIn,
    check_out: checkOut,
  });
  batchRequests.push({
    type:    'attractions',
    city:    city.city_name,
    country: city.country || '',
    date:    checkIn,
  });
}

return [{ json: { tripContext, weather_results: weatherResults, batch_payload: { requests: batchRequests } } }];
"""

# ROOT-CAUSE FIX: was only returning { tripContext }, never setting enriched_cities.
# Build Itinerary Prompt reads j.enriched_cities[0] for topCity — without this,
# city_name/country are undefined in the final itinerary.
MERGE_SEARCH_RESULTS = r"""
const searchResult = items[0].json.result || items[0].json || {};
const collectData  = $('Collect All Planner Data').first().json;
const tripContext  = collectData.tripContext || {};
const weatherResults = collectData.weather_results || [];

// Safely coerce any value to an array regardless of backend response shape
function toArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (Array.isArray(val.forecast))    return val.forecast;
  if (Array.isArray(val.weather))     return val.weather;
  if (Array.isArray(val.data))        return val.data;
  if (Array.isArray(val.results))     return val.results;
  if (Array.isArray(val.hotels))      return val.hotels;
  if (Array.isArray(val.attractions)) return val.attractions;
  return [];
}

// Index weather by lowercased city name for fast lookup
const weatherByCity = {};
for (const w of weatherResults) {
  if (w.city) weatherByCity[w.city.toLowerCase()] = w;
}

// Hotels/attractions may be nested under various keys
const hotelsMap      = searchResult.hotels      || searchResult.hotel      || {};
const attractionsMap = searchResult.attractions  || searchResult.attraction  || {};

// Build enriched cities, preserving city_name + country from recommended_destinations
const top3 = (tripContext.recommended_destinations || []).slice(0, 3);

const enrichedCities = top3.map((city, idx) => {
  const key      = (city.city_name || '').toLowerCase();
  const wEntry   = weatherByCity[key] || weatherResults[idx] || {};
  const hotels   = hotelsMap[city.city_name] || hotelsMap[key] || [];
  const attracts = attractionsMap[city.city_name] || attractionsMap[key] || [];

  return {
    city_name:      city.city_name,
    country:        city.country || '',
    combined_score: city.combined_score || 0,
    coordinates:    city.coordinates || {},
    top_pois:       city.top_pois || [],
    scraped: {
      weather:     toArr(wEntry.weather?.forecast ?? wEntry.weather ?? wEntry.weather_data ?? wEntry),
      hotels:      toArr(hotels),
      attractions: toArr(attracts),
    },
  };
});

tripContext.planner_data = {
  weather:     weatherResults,
  hotels:      hotelsMap,
  attractions: attractionsMap,
};

return [{ json: { tripContext, enriched_cities: enrichedCities } }];
"""

RETURN_PLANNER_RESULT = r"""
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const llmOutput  = items[0].json;
const promptData = $('Build Itinerary Prompt').item.json;
const tripContext = promptData.tripContext;
const topCity    = promptData.top_city || {};
const prefs      = tripContext.preferences;
const result     = { agent: 'planner', success: false, itinerary: null, errors: [] };

const baseItinerary = {
  trip_id:       generateUUID(),
  generated_at:  new Date().toISOString(),
  destination: {
    city:        topCity.city_name,
    country:     topCity.country || '',
    coordinates: topCity.coordinates || {},
  },
  trip_details: {
    departure_date: prefs.departure_date,
    duration_days:  prefs.trip_duration_days,
    travelers:      prefs.number_of_members,
    budget:         prefs.budget,
  },
};

try {
  const rawText  = (llmOutput.output || JSON.stringify(llmOutput)).trim();
  const cleaned  = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const itinData = JSON.parse(cleaned);
  if (!itinData.summary || !itinData.days) {
    result.errors.push('Itinerary missing required keys (summary, days)');
  } else if (!Array.isArray(itinData.days) || !itinData.days.length) {
    result.errors.push('Days array is empty or invalid');
  } else {
    result.success   = true;
    result.itinerary = { ...baseItinerary, summary: itinData.summary, days: itinData.days };
  }
} catch(e) {
  result.errors.push('Parse error: ' + e.message);
  // Avoid re-scraping loop: mark success with raw output so pipeline advances
  result.success   = true;
  result.itinerary = { ...baseItinerary, raw_output: (llmOutput.output || '').slice(0, 5000), parse_error: e.message };
}

tripContext.agent_results.planner = result;
if (result.success) tripContext.final_itinerary = result.itinerary;
tripContext.updated_at = new Date().toISOString();
return [{ json: { tripContext, agent_result: result } }];
"""

# ── Node name → (field, old_value, new_value) for URL patches ────────────────
HTTP_URL_MAP = {
    "Execute - FAISS RAG Script":      f"{BACKEND}/nearest-city",
    "Execute - Flights Per City":      f"{BACKEND}/booking/flights",
    "Execute - Planner Script Per City": f"{BACKEND}/booking/weather",
    "POST - Booking Search":           f"{BACKEND}/booking/search",
    # GET - Poll Booking Search uses a dynamic expression; we leave it alone
}

# ── Apply patches ─────────────────────────────────────────────────────────────
patched = 0
for node in wf["nodes"]:
    name   = node.get("name", "")
    params = node.get("parameters", {})

    if name == "Build Planner Payload":
        params["jsCode"] = BUILD_PLANNER_PAYLOAD
        patched += 1
        print(f"  [OK] Patched: {name}")

    elif name == "Collect All Planner Data":
        params["jsCode"] = COLLECT_ALL_PLANNER_DATA
        patched += 1
        print(f"  [OK] Patched: {name}")

    elif name == "Merge Search Results":
        params["jsCode"] = MERGE_SEARCH_RESULTS
        patched += 1
        print(f"  [OK] Patched: {name}  (ROOT-CAUSE FIX - enriched_cities now populated)")

    elif name == "Return to Orch - Planner Result":
        params["jsCode"] = RETURN_PLANNER_RESULT
        patched += 1
        print(f"  [OK] Patched: {name}")

    elif name == "DeepSeek Chat Model - Planner":
        params.setdefault("options", {})["maxTokens"] = 30000
        patched += 1
        print(f"  [OK] Patched: {name}  ->  maxTokens=30000")

    # Patch static HTTP URLs
    if name in HTTP_URL_MAP:
        old_url = params.get("url", "")
        params["url"] = HTTP_URL_MAP[name]
        patched += 1
        print(f"  [OK] URL:     {name}")
        print(f"               {old_url or '(was expression)'}")
        print(f"            -> {HTTP_URL_MAP[name]}")

    # Also patch the dynamic poll URL host portion if needed
    if name == "GET - Poll Booking Search" and BACKEND != "http://host.docker.internal:8000":
        old_url = params.get("url", "")
        params["url"] = old_url.replace("http://host.docker.internal:8000", BACKEND)
        patched += 1
        print(f"  [OK] URL:     {name}  (host replaced)")

print(f"\nTotal patches applied: {patched}")

# ── Write output ──────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(os.path.abspath(args.src)), "n8n_workflow_updated.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(wf, f, ensure_ascii=False, indent=2)

print(f"Saved -> {out}")
