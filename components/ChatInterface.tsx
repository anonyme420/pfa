'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import {
  Send,
  Plane,
  MapPin,
  Star,
  Hotel,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { useChat } from '@/lib/context/ChatContext';
import { useAuth } from '@/lib/context/AuthContext';
import SuggestionCards from './SuggestionCards';
import { chatService } from '@/lib/services/api';

// ─── n8n itinerary types ──────────────────────────────────────────────────────

interface N8nActivity {
  name: string;
  type: string;
  description: string;
  location: string;
  estimated_duration_hours: number;
  estimated_cost: number;
  tips?: string;
}

interface N8nTimeSlot {
  time_slot: string;
  activities: N8nActivity[];
}

interface N8nDay {
  day_number: number;
  date: string;
  day_label: string;
  theme: string;
  weather: { condition: string; temp_high: number; temp_low: number };
  morning: N8nTimeSlot;
  afternoon: N8nTimeSlot;
  evening: N8nTimeSlot;
  day_total_estimated_cost: number;
  notes?: string;
}

interface N8nItinerary {
  destination: { city: string; country: string };
  trip_details: {
    departure_date: string;
    duration_days: number;
    travelers: number;
    budget: { amount: number; currency: string; budget_type: string };
  };
  summary: {
    total_estimated_cost: number;
    recommended_hotel: { name: string; justification: string; total_price: number };
    travel_tips: string[];
    packing_suggestions?: string[];
  };
  days: N8nDay[];
}

// ─── Day card (collapsible) ───────────────────────────────────────────────────

function DayCard({ day }: { day: N8nDay }) {
  const [expanded, setExpanded] = useState(day.day_number <= 2);

  const slots = [
    { label: 'Morning',   data: day.morning },
    { label: 'Afternoon', data: day.afternoon },
    { label: 'Evening',   data: day.evening },
  ];

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f8fafc] hover:bg-[#f0f5fa] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1a3a5c] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {day.day_number}
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              {day.day_label} · {day.theme}
            </p>
            <p className="text-[10px] text-gray-400">
              {day.weather.condition} · {day.weather.temp_high}°/{day.weather.temp_low}° ·{' '}
              ~${day.day_total_estimated_cost.toLocaleString()}
            </p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        }
      </button>

      {expanded && (
        <div>
          {slots.map(({ label, data }) =>
            data.activities.length > 0 ? (
              <div key={label}>
                <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {label} · {data.time_slot}
                </p>
                {data.activities.map((act, i) => (
                  <div key={i} className="flex gap-3 px-4 py-2 border-t border-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 leading-tight">{act.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{act.description}</p>
                      {act.tips && (
                        <p className="text-[10px] text-amber-600 mt-0.5 italic">💡 {act.tips}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                      ${act.estimated_cost}
                    </span>
                  </div>
                ))}
              </div>
            ) : null,
          )}
          {day.notes && (
            <p className="px-4 py-2.5 text-[11px] text-gray-500 italic border-t border-gray-50">
              {day.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Full itinerary card ──────────────────────────────────────────────────────

function ItineraryCard({ itinerary }: { itinerary: N8nItinerary }) {
  const { destination, trip_details, summary, days } = itinerary;
  const budget = trip_details.budget;

  return (
    <div className="mt-2 w-full space-y-4">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3a5c] rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4" />
          <h3 className="font-bold text-base">
            {destination.city}, {destination.country}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: trip_details.duration_days,  label: 'Days'     },
            { value: trip_details.travelers,       label: 'Travelers'},
            { value: `$${summary.total_estimated_cost.toLocaleString()}`, label: 'Total est.'},
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold leading-tight">{value}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-white/60 mt-2">
          Departs {trip_details.departure_date} ·{' '}
          {budget.amount.toLocaleString()} {budget.currency} ({budget.budget_type})
        </p>
      </div>

      {/* Recommended hotel */}
      <div className="bg-[#f0f5fa] border border-[#dbe8f4] rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Hotel className="w-3.5 h-3.5 text-[#1a3a5c]" />
          <p className="text-xs font-semibold text-[#1a3a5c]">Recommended Hotel</p>
          <span className="ml-auto text-xs font-bold text-[#1a3a5c]">
            ${summary.recommended_hotel.total_price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800">{summary.recommended_hotel.name}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{summary.recommended_hotel.justification}</p>
      </div>

      {/* Day-by-day */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Day-by-Day Plan
        </p>
        <div className="space-y-2">
          {days.map((day) => (
            <DayCard key={day.day_number} day={day} />
          ))}
        </div>
      </div>

      {/* Travel tips */}
      {summary.travel_tips?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5">
          <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Travel Tips
          </p>
          <div className="space-y-1.5">
            {summary.travel_tips.slice(0, 5).map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packing */}
      {summary.packing_suggestions && summary.packing_suggestions.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">Packing Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {summary.packing_suggestions.map((item, i) => (
              <span key={i} className="text-[10px] bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-gray-600">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Thinking indicator (Claude-style) ───────────────────────────────────────

const THINKING_PHASES = [
  'Searching for destinations…',
  'Scoring by your preferences…',
  'Checking flight availability…',
  'Selecting top cities…',
  'Gathering points of interest…',
  'Building your day-by-day plan…',
  'Calculating costs & hotels…',
  'Finalising your itinerary…',
];

function ThinkingIndicator({ status }: { status: string }) {
  const [dots, setDots]       = useState(1);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [shimmer, setShimmer]  = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots(n => (n % 3) + 1), 420);
    const p = setInterval(() => setPhaseIdx(n => (n + 1) % THINKING_PHASES.length), 2800);
    const s = setInterval(() => setShimmer(n => (n + 2) % 110), 30);
    return () => { clearInterval(d); clearInterval(p); clearInterval(s); };
  }, []);

  const label = status.startsWith('Searching') || status.startsWith('Still')
    ? THINKING_PHASES[phaseIdx]
    : status;

  return (
    <div className="bg-white rounded-xl rounded-tl-none border border-slate-200 px-4 py-3.5 shadow-sm max-w-[17rem]">
      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-2">
        {/* Pulsing orb */}
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3a5c] opacity-40" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1a3a5c]" />
        </span>
        <span className="text-xs font-semibold text-slate-700">
          Thinking
          <span className="text-slate-400 font-normal ml-px">{'.'.repeat(dots)}</span>
        </span>
      </div>

      {/* Cycling status */}
      <p className="text-[11px] text-gray-500 leading-relaxed mb-2.5 min-h-[2rem]">{label}</p>

      {/* Shimmer progress bar */}
      <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-transparent via-[#1a3a5c] to-transparent"
          style={{ width: '45%', transform: `translateX(${shimmer * 2.2}%)`, transition: 'transform 30ms linear' }}
        />
      </div>
    </div>
  );
}

// ─── Rich message ─────────────────────────────────────────────────────────────

interface RichMessage extends ChatMessage {
  richContent?: ReactNode;
}

// ─── Main component ───────────────────────────────────────────────────────────

const POLL_INITIAL_DELAY_MS = 30_000;           // wait 30s before first poll
const POLL_INTERVAL_MS      = 1_000;            // then poll every 1s
const POLL_TIMEOUT_MS       = 30 * 60 * 1_000; // 30 min max

export default function ChatInterface() {
  const [input,         setInput]         = useState('');
  const [isSending,     setIsSending]     = useState(false);
  const [pollingStatus, setPollingStatus] = useState<string | null>(null);
  const [richMessages,  setRichMessages]  = useState<RichMessage[]>([]);

  const n8nSessionId  = useRef<string | null>(null);
  const pollingTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingStart  = useRef<number>(0);
  const messagesEnd   = useRef<HTMLDivElement>(null);

  const { currentSession, addMessage } = useChat();
  useAuth();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [richMessages, pollingStatus]);

  // Sync context messages when session switches
  useEffect(() => {
    if (!currentSession) return;
    setRichMessages((prev) => {
      const richMap = new Map(prev.map((m) => [m.id, m.richContent]));
      return (currentSession.messages || []).map((m) => {
        // Prefer in-memory richContent if the message is already rendered
        const existing = richMap.get(m.id);
        if (existing) return { ...m, richContent: existing };
        // Reconstruct itinerary card from saved metadata
        const itin = (m.metadata as any)?.itinerary;
        if (itin) {
          return {
            ...m,
            richContent: <ItineraryCard itinerary={itin} />,
          };
        }
        return { ...m, richContent: undefined };
      });
    });
    // Fresh n8n session for each chat session
    n8nSessionId.current = null;
    setPollingStatus(null);
  }, [currentSession?.id]);

  // Clear polling timers on unmount
  useEffect(() => {
    return () => {
      if (pollingTimer.current) clearTimeout(pollingTimer.current);
    };
  }, []);

  const pushAI = useCallback(
    (content: string, richContent?: ReactNode, metadata?: Record<string, unknown>): RichMessage => {
      const msg: RichMessage = {
        id: `ai-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content,
        sessionId: currentSession?.id ?? '',
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        richContent,
      };
      addMessage(msg);
      setRichMessages((prev) => [...prev, msg]);
      if (currentSession?.id) {
        chatService
          .sendMessage(currentSession.id, 'assistant', content, metadata)
          .catch((err) => console.error('[DB] save AI message failed:', err));
      }
      return msg;
    },
    [addMessage, currentSession?.id],
  );

  const pushUser = useCallback(
    (content: string) => {
      const msg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        role: 'user',
        content,
        sessionId: currentSession?.id ?? '',
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      setRichMessages((prev) => [...prev, msg]);
      if (currentSession?.id) {
        chatService
          .sendMessage(currentSession.id, 'user', content)
          .catch((err) => console.error('[DB] save user message failed:', err));
      }
    },
    [addMessage, currentSession?.id],
  );

  const applyN8nResponse = useCallback(
    (data: any) => {
      setPollingStatus(null);
      setIsSending(false);

      if (data.type === 'agent_message') {
        pushAI(data.message || 'How can I help you plan your trip?');
      } else if (data.type === 'itinerary' && data.itinerary) {
        pushAI(
          data.message || `Your itinerary for ${data.itinerary.destination?.city} is ready!`,
          <ItineraryCard itinerary={data.itinerary} />,
          { itinerary: data.itinerary },
        );
      } else if (data.type === 'error') {
        pushAI(data.message || 'Something went wrong. Please try again.');
      } else {
        pushAI(data.message || 'Processing complete.');
      }
    },
    [pushAI],
  );

  const schedulePoll = useCallback(
    (sid: string, isFirstPoll = false) => {
      if (pollingTimer.current) clearTimeout(pollingTimer.current);

      if (Date.now() - pollingStart.current > POLL_TIMEOUT_MS) {
        setIsSending(false);
        setPollingStatus(null);
        pushAI('The request timed out. Please try again.');
        return;
      }

      const delay = isFirstPoll ? POLL_INITIAL_DELAY_MS : POLL_INTERVAL_MS;

      pollingTimer.current = setTimeout(async () => {
        try {
          const res  = await fetch(`/api/travel/status?session_id=${encodeURIComponent(sid)}`);
          const data = await res.json();

          if (data.type === 'processing' || data.status === 'processing') {
            setPollingStatus(data.message || 'Still working on it…');
            schedulePoll(sid, false);
          } else {
            applyN8nResponse(data);
          }
        } catch {
          setIsSending(false);
          setPollingStatus(null);
          pushAI('Connection error while processing. Please try again.');
        }
      }, delay);
    },
    [applyN8nResponse, pushAI],
  );

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !currentSession || isSending) return;

    const content = input.trim();
    setInput('');
    pushUser(content);
    setIsSending(true);

    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:    content,
          session_id: n8nSessionId.current ?? undefined,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Persist n8n session id across turns
      if (data.session_id) n8nSessionId.current = data.session_id;

      if (data.type === 'ack') {
        pollingStart.current = Date.now();
        setPollingStatus(data.message || 'Searching destinations & building itinerary…');
        schedulePoll(data.session_id ?? n8nSessionId.current!, true);
      } else {
        applyN8nResponse(data);
      }
    } catch (err) {
      console.error('[ChatInterface] send error:', err);
      setIsSending(false);
      setPollingStatus(null);
      pushAI('Could not reach the travel AI. Please try again.');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const form = document.querySelector('form');
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }, 0);
  };

  // ── Empty state ──────────────────────────────────────────────────────────────

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3 px-6">
          <div className="w-14 h-14 rounded-xl bg-[#0a1628] flex items-center justify-center mx-auto">
            <Plane className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold tracking-wide text-slate-700 uppercase">No trip selected</p>
          <p className="text-xs text-slate-400 max-w-[18rem] mx-auto leading-relaxed">
            Create a new trip from the sidebar to begin planning with your AI navigator.
          </p>
        </div>
      </div>
    );
  }

  // ── Chat view ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 min-h-0">
        {richMessages.length === 0 && !isSending ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <SuggestionCards onSuggestionClick={handleSuggestionClick} isLoading={false} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
            {richMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {message.role === 'assistant' && (
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0a1628] flex items-center justify-center mt-5">
                      <Plane className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
                          TravelAI
                        </span>
                        <span className="w-1 h-1 rounded-full bg-emerald-400 block" />
                      </div>
                      <div className="bg-white text-slate-800 rounded-xl rounded-tl-none border border-slate-200 px-4 py-3.5 break-words shadow-sm">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        {message.richContent && <div className="mt-3">{message.richContent}</div>}
                        <span className="text-[10px] text-slate-300 mt-2.5 block">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="max-w-[78%]">
                    <div className="bg-[#0a1628] text-white rounded-xl rounded-tr-none px-4 py-3.5 break-words shadow-sm">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <span className="text-[10px] text-blue-300/50 mt-2.5 block text-right">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing / polling indicator */}
            {isSending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0a1628] flex items-center justify-center mt-5">
                    <Plane className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="mt-5">
                    {pollingStatus ? (
                      <ThinkingIndicator status={pollingStatus} />
                    ) : (
                      <div className="bg-white px-4 py-3.5 rounded-xl rounded-tl-none border border-slate-200 shadow-sm">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEnd} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 sm:px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:shadow-md transition-all shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder="Tell me where you'd like to go…"
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                input.trim() && !isSending
                  ? 'bg-[#0a1628] hover:bg-blue-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" strokeWidth={2} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-300 text-center mt-2 tracking-wide">
            Press Enter to send · AI-powered travel planning
          </p>
        </form>
      </div>
    </div>
  );
}
