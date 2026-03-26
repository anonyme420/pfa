'use client';

import { Plane, Hotel, Utensils, DollarSign, Map, Ticket } from 'lucide-react';

interface SuggestionCardsProps {
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

export default function SuggestionCards({
  onSuggestionClick,
  isLoading = false,
}: SuggestionCardsProps) {
  const suggestions = [
    {
      icon: Plane,
      title: 'Plan a Trip',
      description: 'Tell me about your dream destination',
      prompt: 'I want to plan a trip to Europe next summer. Can you help me?',
    },
    {
      icon: Hotel,
      title: 'Find Accommodations',
      description: 'Search for hotels, hostels, or Airbnbs',
      prompt: 'What are the best budget-friendly hotels in Barcelona?',
    },
    {
      icon: Utensils,
      title: 'Discover Activities',
      description: 'Find things to do and local experiences',
      prompt: 'What are must-visit restaurants and activities in Tokyo?',
    },
    {
      icon: DollarSign,
      title: 'Budget Planning',
      description: 'Create a travel budget breakdown',
      prompt: 'Help me create a budget for a 2-week trip to Thailand',
    },
    {
      icon: Map,
      title: 'Itinerary',
      description: 'Get a personalized day-by-day itinerary',
      prompt: 'Create a 5-day itinerary for visiting Italy',
    },
    {
      icon: Ticket,
      title: 'Flight Deals',
      description: 'Find the best flight options',
      prompt: 'Find me the cheapest flights from New York to London',
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        How can I help you today?
      </h2>
      <p className="text-center text-gray-600 mb-6 text-sm">
        Choose a topic or ask me anything about travel planning
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, idx) => {
          const IconComponent = suggestion.icon;
          return (
            <button
              key={idx}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              disabled={isLoading}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-left group"
            >
              <div className="mb-2 group-hover:scale-110 transition-transform inline-block">
                <IconComponent className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {suggestion.title}
              </h3>
              <p className="text-xs text-gray-600">
                {suggestion.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
