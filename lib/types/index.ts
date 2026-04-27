// User and Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Chat Types
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  metadata?: Record<string, any>;
  timestamp:string;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
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
  
}
