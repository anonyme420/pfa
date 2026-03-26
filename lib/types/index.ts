// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  itinerary?: TravelItinerary;
}

// Travel Itinerary Types
export interface TravelItinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
  accommodations: Accommodation[];
  flights: Flight[];
  budget: number;
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  time?: string;
  duration?: number;
  location: string;
  description: string;
  cost?: number;
  category: string;
}

export interface Accommodation {
  id: string;
  name: string;
  checkInDate: string;
  checkOutDate: string;
  address: string;
  costPerNight: number;
  nights: number;
  bookingUrl?: string;
}

export interface Flight {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  cost: number;
  bookingUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  suggestions?: string[];
  updatedItinerary?: TravelItinerary;
}
