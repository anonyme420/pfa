'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  Send,
  Lightbulb,
  Plane,
  Check,
  MapPin,
  Clock,
  Euro,
  Star,
  ChevronRight,
  Coffee,
  Landmark,
  ShoppingBag,
  Utensils,
  Wine,
  Mountain,
  Ship,
  Music,
  Building2,
  Fish,
  Anchor,
  Calendar,
  Wallet,
  Users,
  Backpack,
  Heart,
  Baby,
  PartyPopper,
  Train,
  Ticket,
  Sun,
  Camera,
  UtensilsCrossed,
  Grape,
  Castle,
  Waves,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { useChat } from '@/lib/context/ChatContext';
import { useAuth } from '@/lib/context/AuthContext';
import SuggestionCards from './SuggestionCards';

// ─── Types ────────────────────────────────────────────────────────────────────

type TravelFlowStep = 'idle' | 'city-select' | 'duration' | 'budget' | 'travelers' | 'itinerary';

interface Activity {
  time: string;
  Icon: React.FC<{ className?: string }>;
  title: string;
  detail: string;
}

interface DayPlan {
  activities: Activity[];
}

interface TravelAnswers {
  cities: string[];
  duration: string;
  budget: string;
  travelers: string;
}

// ─── Unsplash photos (free, no API key needed) ────────────────────────────────

const CITY_PHOTOS: Record<string, string> = {
  Paris:      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  Nice:       'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=600&q=80',
  Lyon:       'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&q=80',
  Bordeaux:   'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80',
  Strasbourg: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80',
  Marseille:  'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=600&q=80',
};

const CITY_GRADIENTS: Record<string, string> = {
  Paris:      'from-blue-900 to-indigo-700',
  Nice:       'from-cyan-600 to-blue-500',
  Lyon:       'from-red-800 to-orange-600',
  Bordeaux:   'from-purple-900 to-red-800',
  Strasbourg: 'from-amber-700 to-yellow-600',
  Marseille:  'from-teal-700 to-cyan-500',
};

// ─── Static data ──────────────────────────────────────────────────────────────

const FRANCE_CITIES = [
  { name: 'Paris',       tagline: 'City of Light',  sub: 'Eiffel · Louvre · Seine' },
  { name: 'Nice',        tagline: 'French Riviera', sub: 'Beaches · Markets · Azur' },
  { name: 'Lyon',        tagline: 'Food capital',   sub: 'Bouchons · Silk · Fourvière' },
  { name: 'Bordeaux',    tagline: 'Wine country',   sub: 'Châteaux · Cité du Vin' },
  { name: 'Strasbourg',  tagline: 'Alsatian gem',   sub: 'Cathedral · EU · Petite France' },
  { name: 'Marseille',   tagline: 'Port city',      sub: 'Calanques · Bouillabaisse' },
];

const CITY_PLANS: Record<string, DayPlan> = {
  Paris: {
    activities: [
      { time: '09:00', Icon: Coffee,          title: 'Café de Flore',             detail: 'Croissant & café au lait in St-Germain-des-Prés' },
      { time: '10:30', Icon: Landmark,        title: 'Eiffel Tower',              detail: 'Skip-the-line tickets — book online the day before' },
      { time: '13:00', Icon: ShoppingBag,     title: 'Marché des Enfants Rouges', detail: "Paris's oldest covered market — mezze & French tapas" },
      { time: '15:00', Icon: Camera,          title: "Musée d'Orsay",             detail: 'Impressionist masterpieces — Monet, Renoir, Van Gogh' },
      { time: '19:30', Icon: Wine,            title: 'Montmartre at dusk',        detail: 'Wine & charcuterie overlooking the entire city' },
    ],
  },
  Nice: {
    activities: [
      { time: '08:00', Icon: Waves,           title: 'Promenade des Anglais',     detail: 'Morning walk along the legendary seafront boulevard' },
      { time: '10:00', Icon: ShoppingBag,     title: 'Cours Saleya market',       detail: 'Flowers, olives, lavender & Niçoise specialties' },
      { time: '12:30', Icon: Utensils,        title: 'Socca in Vieux-Nice',       detail: "Crispy chickpea pancake — the city's street food icon" },
      { time: '14:30', Icon: Mountain,        title: 'Èze village',               detail: 'Medieval perched village with panoramic Riviera views' },
      { time: '19:00', Icon: Star,            title: 'Dinner at Le Safari',       detail: 'Terrace dining with sea views & local rosé' },
    ],
  },
  Lyon: {
    activities: [
      { time: '09:00', Icon: Coffee,          title: 'Bouchon breakfast',         detail: 'Eggs en meurette & andouillette at a local bouchon' },
      { time: '11:00', Icon: Building2,       title: 'Vieux-Lyon',                detail: 'UNESCO old town — Renaissance traboules & courtyards' },
      { time: '13:00', Icon: UtensilsCrossed, title: 'Paul Bocuse market',        detail: 'World-class charcuterie, cheese & freshly shucked oysters' },
      { time: '15:30', Icon: Landmark,        title: 'Fourvière Basilica',        detail: 'Hilltop basilica with sweeping views over the city' },
      { time: '19:30', Icon: Star,            title: 'Starred dinner',            detail: "One of Lyon's 20+ Michelin-starred restaurants" },
    ],
  },
  Bordeaux: {
    activities: [
      { time: '09:30', Icon: Grape,           title: 'La Cité du Vin',            detail: "Immersive wine museum — the world's best of its kind" },
      { time: '12:00', Icon: ShoppingBag,     title: 'Marché des Capucins',       detail: 'Canelé pastries, foie gras & aged Comté' },
      { time: '14:00', Icon: Castle,          title: 'Vineyard tour',             detail: 'Château Pétrus or Margaux — cellar tour & tasting' },
      { time: '17:00', Icon: Landmark,        title: 'Pont de Pierre',            detail: 'Golden hour stroll across the stone bridge on the Garonne' },
      { time: '20:00', Icon: Utensils,        title: 'Le Chapon Fin',             detail: 'Historic brasserie — entrecôte bordelaise & Médoc red' },
    ],
  },
  Strasbourg: {
    activities: [
      { time: '09:00', Icon: Castle,          title: 'Strasbourg Cathedral',      detail: 'Gothic masterpiece — climb for views over Alsace' },
      { time: '11:00', Icon: Ship,            title: 'River boat tour',           detail: 'Glide along the Ill through La Petite France district' },
      { time: '13:00', Icon: Utensils,        title: 'Winstub lunch',             detail: 'Flammekueche & Alsatian beer in a half-timbered inn' },
      { time: '15:30', Icon: Building2,       title: 'European Parliament',       detail: 'Guided tour of EU democracy — free with advance booking' },
      { time: '19:00', Icon: Music,           title: 'Place du Marché',           detail: 'Evening drinks in the heart of the old town' },
    ],
  },
  Marseille: {
    activities: [
      { time: '08:30', Icon: Fish,            title: 'Vieux-Port fish market',    detail: 'Freshest catch in France — straight off the boats at dawn' },
      { time: '10:30', Icon: Anchor,          title: 'Calanques boat trip',       detail: 'Turquoise fjords & limestone cliffs — national park tour' },
      { time: '13:00', Icon: UtensilsCrossed, title: 'Chez Fonfon',               detail: 'Authentic bouillabaisse — the dish that defines Marseille' },
      { time: '15:30', Icon: Landmark,        title: 'Notre-Dame de la Garde',    detail: 'Hilltop basilica with 360° panoramas over sea & city' },
      { time: '18:30', Icon: Wine,            title: 'Cours Julien',              detail: 'Pastis at a terrace bar as the sun melts into the Med' },
    ],
  },
};

const DURATION_OPTIONS = [
  { label: 'Long weekend', sub: '4 days',  Icon: Calendar },
  { label: '1 week',       sub: '7 days',  Icon: Calendar },
  { label: '10 days',      sub: '10 days', Icon: Calendar },
  { label: '2 weeks',      sub: '14 days', Icon: Calendar },
];

const BUDGET_OPTIONS = [
  { label: 'Budget traveller', sub: '~€60/day',  Icon: Wallet },
  { label: 'Mid-range',        sub: '~€120/day', Icon: Wallet },
  { label: 'Luxury',           sub: '€250+/day', Icon: Star   },
];

const TRAVELER_OPTIONS = [
  { label: 'Solo explorer',    Icon: Backpack    },
  { label: 'Couple',           Icon: Heart       },
  { label: 'Family with kids', Icon: Baby        },
  { label: 'Friends group',    Icon: PartyPopper },
];

// ─── CityCard with real Unsplash photo ───────────────────────────────────────

function CityCard({
  city,
  isSelected,
  onToggle,
}: {
  city: typeof FRANCE_CITIES[number];
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const gradient = CITY_GRADIENTS[city.name] ?? 'from-gray-700 to-gray-500';

  return (
    <button
      onClick={onToggle}
      className={`relative rounded-xl border-2 text-left transition-all duration-200 overflow-hidden w-full
        ${isSelected
          ? 'border-[#1a3a5c] shadow-lg scale-[1.03]'
          : 'border-transparent hover:border-[#1a3a5c]/40 hover:scale-[1.01]'
        }`}
    >
      {/* Photo */}
      <div className="relative h-24 overflow-hidden">
        {!imgError ? (
          <img
            src={CITY_PHOTOS[city.name]}
            alt={city.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* City label over photo */}
        <div className="absolute bottom-0 left-0 px-2 pb-1.5">
          <p className="text-white text-xs font-bold leading-tight drop-shadow">{city.name}</p>
          <p className="text-white/75 text-[9px] leading-tight drop-shadow">{city.tagline}</p>
        </div>

        {/* Check badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#1a3a5c] flex items-center justify-center shadow-md">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Sub-label */}
      <div className="px-2 py-1.5 bg-white border-t border-gray-100">
        <p className="text-[9.5px] text-gray-400 leading-tight truncate">{city.sub}</p>
      </div>
    </button>
  );
}

// ─── CityGrid ─────────────────────────────────────────────────────────────────

function CityGrid({
  selected,
  onToggle,
  onConfirm,
}: {
  selected: string[];
  onToggle: (city: string) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="mt-3 w-full">
      <div className="grid grid-cols-3 gap-2">
        {FRANCE_CITIES.map((city) => (
          <CityCard
            key={city.name}
            city={city}
            isSelected={selected.includes(city.name)}
            onToggle={() => onToggle(city.name)}
          />
        ))}
      </div>
      {selected.length > 0 && (
        <button
          onClick={onConfirm}
          className="mt-3 w-full py-2.5 bg-[#1a3a5c] hover:bg-[#14304f] text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plane className="w-4 h-4" />
          Explore {selected.join(', ')}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Self-contained city picker ───────────────────────────────────────────────

function FranceCityPickerWrapper({ onConfirm }: { onConfirm: (cities: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggle = (city: string) => {
    if (confirmed) return;
    setSelected((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    setConfirmed(true);
    onConfirm(selected);
  };

  if (confirmed) {
    return (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {selected.map((c) => (
          <span key={c} className="flex items-center gap-1 px-2.5 py-1 bg-[#1a3a5c] text-white text-xs rounded-full">
            <MapPin className="w-3 h-3" /> {c}
          </span>
        ))}
      </div>
    );
  }

  return <CityGrid selected={selected} onToggle={toggle} onConfirm={handleConfirm} />;
}

// ─── OptionChips ──────────────────────────────────────────────────────────────

function OptionChips({
  options,
  onSelect,
}: {
  options: { label: string; sub?: string; Icon: React.FC<{ className?: string }> }[];
  onSelect: (val: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="mt-3 flex flex-col gap-2">
      {options.map((opt) => {
        const isChosen = chosen === opt.label;
        return (
          <button
            key={opt.label}
            disabled={!!chosen}
            onClick={() => {
              setChosen(opt.label);
              onSelect(opt.sub ? `${opt.label} (${opt.sub})` : opt.label);
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-all
              ${isChosen
                ? 'border-[#1a3a5c] bg-[#f0f5fa] text-[#1a3a5c]'
                : 'border-gray-200 bg-white hover:border-[#1a3a5c]/50 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
          >
            <opt.Icon className={`w-4 h-4 flex-shrink-0 ${isChosen ? 'text-[#1a3a5c]' : 'text-gray-400'}`} />
            <span className="font-medium">{opt.label}</span>
            {opt.sub && <span className="ml-auto text-xs text-gray-400 font-normal">{opt.sub}</span>}
            {isChosen && <Check className="w-4 h-4 text-[#1a3a5c] ml-1 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  Icon,
}: {
  value: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f0f5fa] rounded-xl p-3 border border-[#dbe8f4]">
      <Icon className="w-4 h-4 text-[#1a3a5c] mb-1" />
      <p className="text-sm font-semibold text-gray-800 text-center leading-tight">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

// ─── City photo header with error fallback ────────────────────────────────────

function CityPhotoHeader({ cityName }: { cityName: string }) {
  const [imgError, setImgError] = useState(false);
  const gradient = CITY_GRADIENTS[cityName] ?? 'from-gray-700 to-gray-500';

  if (imgError) {
    return <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />;
  }

  return (
    <img
      src={CITY_PHOTOS[cityName]}
      alt={cityName}
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}

// ─── Itinerary card ───────────────────────────────────────────────────────────

function ItineraryCard({ answers }: { answers: TravelAnswers }) {
  const citiesToShow = answers.cities.slice(0, 3);

  return (
    <div className="mt-2 w-full">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatCard value={String(answers.cities.length)} label="Cities"    Icon={MapPin}  />
        <StatCard value={answers.duration.replace(/\s*\(.*\)/, '')}        label="Duration" Icon={Clock}   />
        <StatCard
          value={answers.budget.match(/€[\d+]+\/day/)?.[0] ?? answers.budget.split(' ')[0]}
          label="Per day"
          Icon={Euro}
        />
      </div>

      {/* Day timeline */}
      <div className="space-y-5">
        {citiesToShow.map((cityName, idx) => {
          const plan = CITY_PLANS[cityName] ?? CITY_PLANS['Paris'];
          return (
            <div key={cityName} className="relative pl-10">
              {/* Connecting line */}
              {idx < citiesToShow.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-[-16px] w-px bg-gray-200" />
              )}
              {/* Day bubble */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold shadow-md">
                {idx + 1}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {/* Photo header */}
                <div className="relative h-28 overflow-hidden">
                  <CityPhotoHeader cityName={cityName} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 px-4 pb-3">
                    <p className="text-white font-bold text-base drop-shadow leading-tight">{cityName}</p>
                    <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" /> Full day exploration
                    </p>
                  </div>
                </div>

                {/* Activities */}
                <div className="divide-y divide-gray-50">
                  {plan.activities.map((act) => (
                    <div key={act.time} className="flex gap-3 px-4 py-2.5 hover:bg-gray-50/60 transition-colors">
                      <span className="text-[11px] text-gray-400 font-medium w-10 shrink-0 pt-0.5">{act.time}</span>
                      <div className="shrink-0 w-6 h-6 rounded-lg bg-[#f0f5fa] flex items-center justify-center mt-0.5">
                        <act.Icon className="w-3.5 h-3.5 text-[#1a3a5c]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 leading-tight">{act.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{act.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
        <p className="text-xs font-semibold text-amber-800 mb-2.5 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" /> Insider tips
        </p>
        <div className="space-y-2">
          {[
            { Icon: Train,    text: 'Book TGV trains in advance — save up to 60% on rail fares' },
            { Icon: Utensils, text: 'Lunch "formule" — 3 courses for €15–20, dine like a local' },
            { Icon: Ticket,   text: 'Paris Museum Pass covers 50+ museums — great for culture lovers' },
            { Icon: Sun,      text: 'Best weather: May–June and Sept–Oct, far fewer crowds' },
          ].map(({ Icon: TipIcon, text }) => (
            <div key={text} className="flex items-start gap-2">
              <TipIcon className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Traveler context badge */}
      <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <p className="text-[11px] text-gray-500">
          Personalised for:{' '}
          <span className="font-semibold text-gray-700">{answers.travelers}</span>
          {' · '}
          <span className="font-semibold text-gray-700">{answers.budget.split(' (')[0]}</span> budget
        </p>
      </div>
    </div>
  );
}

// ─── Rich message type ────────────────────────────────────────────────────────

interface RichMessage extends ChatMessage {
  richContent?: ReactNode;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [richMessages, setRichMessages] = useState<RichMessage[]>([]);
  const [flowStep, setFlowStep] = useState<TravelFlowStep>('idle');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentSession, addMessage } = useChat();
  const { session } = useAuth();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [richMessages]);

  useEffect(() => {
    if (!currentSession) return;
    setRichMessages((prev) => {
      const richMap = new Map(prev.map((m) => [m.id, m.richContent]));
      return (currentSession.messages || []).map((m) => ({
        ...m,
        richContent: richMap.get(m.id),
      }));
    });
  }, [currentSession?.messages]);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const isFranceIntent = (text: string) => {
    const l = text.toLowerCase();
    return ['france', 'paris', 'french', 'nice', 'lyon', 'bordeaux', 'marseille', 'strasbourg'].some(
      (kw) => l.includes(kw),
    );
  };

  const pushAI = (content: string, richContent?: ReactNode): RichMessage => {
    const msg: RichMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      richContent,
    };
    addMessage(msg);
    setRichMessages((prev) => [...prev, msg]);
    return msg;
  };

  const pushUser = (content: string) => {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(msg);
    setRichMessages((prev) => [...prev, msg]);
  };

  // ── Flow steps ─────────────────────────────────────────────────────────────

  const handleCitiesConfirmed = async (cities: string[]) => {
    setFlowStep('duration');
    pushUser(`I'd like to visit: ${cities.join(', ')}`);
    setIsSending(true);
    await delay(900);
    setIsSending(false);
    pushAI(
      `Wonderful choices! 🇫🇷 ${cities.join(', ')} — you have excellent taste. How long will you be travelling?`,
      <OptionChips
        options={DURATION_OPTIONS}
        onSelect={(val) => handleDurationSelected(val, cities)}
      />,
    );
  };

  const handleDurationSelected = async (duration: string, cities: string[]) => {
    setFlowStep('budget');
    pushUser(duration);
    setIsSending(true);
    await delay(800);
    setIsSending(false);
    pushAI(
      "Perfect! What's your budget range per person per day?",
      <OptionChips
        options={BUDGET_OPTIONS}
        onSelect={(val) => handleBudgetSelected(val, cities, duration)}
      />,
    );
  };

  const handleBudgetSelected = async (budget: string, cities: string[], duration: string) => {
    setFlowStep('travelers');
    pushUser(budget);
    setIsSending(true);
    await delay(750);
    setIsSending(false);
    pushAI(
      "Almost there! Who's travelling with you?",
      <OptionChips
        options={TRAVELER_OPTIONS}
        onSelect={(val) => handleTravelersSelected(val, cities, duration, budget)}
      />,
    );
  };

  const handleTravelersSelected = async (
    travelers: string,
    cities: string[],
    duration: string,
    budget: string,
  ) => {
    const answers: TravelAnswers = { cities, duration, budget, travelers };
    setFlowStep('itinerary');
    pushUser(travelers);
    setIsSending(true);
    await delay(1400);
    setIsSending(false);
    pushAI(
      'Voilà! 🥐 Here is your personalised France itinerary — crafted just for you. Bon voyage!',
      <ItineraryCard answers={answers} />,
    );
  };

  // ── Send handler ───────────────────────────────────────────────────────────

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSession || isSending) return;

    const content = input.trim();
    setInput('');
    pushUser(content);
    setIsSending(true);

    try {
      await delay(1000);

      if (isFranceIntent(content) && flowStep === 'idle') {
        setIsSending(false);
        setFlowStep('city-select');
        pushAI(
          "Bonjour! 🇫🇷 France — magnifique choice! Let's build your perfect trip. Which cities are calling you?",
          <FranceCityPickerWrapper onConfirm={handleCitiesConfirmed} />,
        );
        return;
      }

      const reply =
        flowStep === 'itinerary'
          ? "Great question! Book your TGV trains at least 3 weeks ahead for the best fares, and grab a Navigo Découverte card for unlimited Paris metro travel. Anything else I can help you plan? ✈️"
          : "I'd love to help you plan your trip! Try telling me where you'd like to go — for example, \"I want to visit France\" — and I'll put together a personalised itinerary. ✈️";

      pushAI(reply);
    } catch (err) {
      console.error(err);
      pushAI('Sorry, there was an error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }, 0);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 bg-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Plane className="w-16 h-16 text-[#1a3a5c]" />
          </div>
          <p className="text-lg font-semibold">No chat session started</p>
          <p className="text-sm text-gray-400">Start a new conversation to begin planning your trip!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 min-h-0"
      >
        {richMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <SuggestionCards onSuggestionClick={handleSuggestionClick} isLoading={isSending} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {richMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {message.role === 'assistant' && (
                  <div className="flex gap-3 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
                    {/* AI avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center shadow-sm">
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                    {/* Bubble */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 text-gray-900 rounded-2xl rounded-bl-none border border-gray-200 px-4 py-3 break-words">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        {message.richContent && <div className="mt-1">{message.richContent}</div>}
                        <span className="text-[10px] text-gray-400 mt-2 block">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
                    <div className="bg-[#1a3a5c] text-white rounded-2xl rounded-br-none px-4 py-3 break-words">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <span className="text-[10px] text-blue-200 mt-2 block text-right">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                    <div className="flex gap-1.5 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="space-y-3 max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder="e.g. I want to visit France…"
              className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 bg-white disabled:opacity-50 transition text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#1a3a5c] hover:bg-[#14304f] text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              {isSending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <Lightbulb className="w-3 h-3 flex-shrink-0" />
            <span>Try: "I want to visit France" to start planning your trip</span>
          </p>
        </form>
      </div>
    </div>
  );
}