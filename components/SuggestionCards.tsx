'use client';

import { Plane, Hotel, Compass, CreditCard, Route, Zap, ArrowRight } from 'lucide-react';

interface SuggestionCardsProps {
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

const SUGGESTIONS = [
  {
    Icon: Plane,
    accent: 'bg-sky-100 text-sky-700 border-sky-200',
    category: 'Trips',
    title: 'Plan a Destination',
    description: 'Tell me where you want to go and I will build your trip',
    prompt: 'I want to plan a trip to Europe next summer. Can you help me?',
  },
  {
    Icon: Hotel,
    accent: 'bg-violet-100 text-violet-700 border-violet-200',
    category: 'Stay',
    title: 'Find Accommodations',
    description: 'Hotels, boutique stays, or hidden gems near your route',
    prompt: 'What are the best budget-friendly hotels in Barcelona?',
  },
  {
    Icon: Compass,
    accent: 'bg-amber-100 text-amber-700 border-amber-200',
    category: 'Explore',
    title: 'Discover Activities',
    description: 'Local experiences, landmarks, and off-the-beaten-path spots',
    prompt: 'What are must-visit restaurants and activities in Tokyo?',
  },
  {
    Icon: CreditCard,
    accent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    category: 'Budget',
    title: 'Plan Your Budget',
    description: 'Get a full cost breakdown tailored to your travel style',
    prompt: 'Help me create a budget for a 2-week trip to Thailand',
  },
  {
    Icon: Route,
    accent: 'bg-blue-100 text-blue-700 border-blue-200',
    category: 'Itinerary',
    title: 'Build an Itinerary',
    description: 'Day-by-day schedule with times, routes, and recommendations',
    prompt: 'Create a 5-day itinerary for visiting Italy',
  },
  {
    Icon: Zap,
    accent: 'bg-rose-100 text-rose-700 border-rose-200',
    category: 'Flights',
    title: 'Find Flight Deals',
    description: 'Compare routes and discover the best fares for your dates',
    prompt: 'Find me the cheapest flights from New York to London',
  },
];

export default function SuggestionCards({ onSuggestionClick, isLoading = false }: SuggestionCardsProps) {
  return (
    <div className="w-full">

      {/* Hero header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            AI Navigator Ready
          </span>
        </div>

        <h2 className="text-3xl font-black text-[#0a1628] tracking-tight leading-tight">
          Where are you headed?
        </h2>
        <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
          Your intelligent travel co-pilot. Ask anything or select a mission below.
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          borderRadius: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
        }}
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onSuggestionClick(s.prompt)}
            disabled={isLoading}
            className="group relative flex flex-col p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left shadow-sm overflow-hidden"
          >
            {/* Top accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-t-xl" />

            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${s.accent}`}>
                <s.Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border ${s.accent}`}>
                {s.category}
              </span>
            </div>

            <p className="font-bold text-sm text-[#0a1628] leading-tight mb-1">{s.title}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed flex-1">{s.description}</p>

            <div className="flex items-center justify-end mt-3">
              <ArrowRight
                className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
                strokeWidth={2}
              />
            </div>
          </button>
        ))}
      </div>

      {/* France teaser */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
        <button
          onClick={() => onSuggestionClick('I want to visit France')}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-500 hover:text-blue-700 text-xs font-semibold tracking-wide transition-all disabled:opacity-50"
        >
          <Plane className="w-3 h-3" strokeWidth={1.75} />
          Try the France interactive planner
          <ArrowRight className="w-3 h-3" strokeWidth={2} />
        </button>
        <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
      </div>
    </div>
  );
}
