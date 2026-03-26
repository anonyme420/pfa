// API Service - Central place for all backend calls
// TODO: Replace with your actual backend URL once ready

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, token } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Auth Service
export const authService = {
  async login(email: string, password: string) {
    // TODO: Implement actual login
    return apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async register(email: string, password: string, name: string) {
    // TODO: Implement actual registration
    return apiCall('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
  },

  async logout() {
    // TODO: Implement actual logout
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser(token: string) {
    // TODO: Implement actual user fetch
    return apiCall('/auth/me', {
      token,
    });
  },
};

// Chat Service
export const chatService = {
  async sendMessage(
    sessionId: string,
    message: string,
    token: string
  ) {
    // TODO: Implement actual chat API
    return apiCall(`/chat/${sessionId}/messages`, {
      method: 'POST',
      body: { content: message },
      token,
    });
  },

  async getChatHistory(sessionId: string, token: string) {
    // TODO: Implement actual history fetch
    return apiCall(`/chat/${sessionId}`, {
      token,
    });
  },

  async createSession(title: string, token: string) {
    // TODO: Implement session creation
    return apiCall('/chat/sessions', {
      method: 'POST',
      body: { title },
      token,
    });
  },

  async listSessions(token: string) {
    // TODO: Implement sessions listing
    return apiCall('/chat/sessions', {
      token,
    });
  },
};

// Travel Planning Service
export const travelService = {
  async generateItinerary(
    destination: string,
    startDate: string,
    endDate: string,
    preferences: Record<string, any>,
    token: string
  ) {
    // TODO: Implement AI itinerary generation
    return apiCall('/travel/generate-itinerary', {
      method: 'POST',
      body: {
        destination,
        startDate,
        endDate,
        preferences,
      },
      token,
    });
  },

  async updateItinerary(itineraryId: string, updates: any, token: string) {
    // TODO: Implement itinerary update
    return apiCall(`/travel/itineraries/${itineraryId}`, {
      method: 'PUT',
      body: updates,
      token,
    });
  },

  async exportItinerary(itineraryId: string, format: 'pdf' | 'json', token: string) {
    // TODO: Implement export functionality
    return apiCall(`/travel/itineraries/${itineraryId}/export?format=${format}`, {
      token,
    });
  },
};
