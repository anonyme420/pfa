// API Service - Central place for all backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiError extends Error {
  constructor(public statusCode: number, public statusText: string) {
    super(`API Error: ${statusCode} ${statusText}`);
  }
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
      throw new ApiError(response.status, response.statusText);
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
    return apiCall<any>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async register(email: string, password: string, name?: string) {
    return apiCall<any>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
  },

  async logout(token: string) {
    return apiCall<any>('/auth/logout', {
      method: 'POST',
      token,
    });
  },

  async refresh(token: string) {
    return apiCall<any>('/auth/refresh', {
      method: 'POST',
      token,
    });
  },

  async getCurrentUser(token: string) {
    return apiCall<any>('/auth/me', {
      token,
    });
  },
};

// Chat Service
export const chatService = {
  async createSession(title: string, token: string) {
    return apiCall<any>('/chat/sessions', {
      method: 'POST',
      body: { title },
      token,
    });
  },

  async listSessions(token: string) {
    return apiCall<any>('/chat/sessions', {
      token,
    });
  },

  async getSession(sessionId: string, token: string) {
    return apiCall<any>(`/chat/${sessionId}`, {
      token,
    });
  },

  async sendMessage(sessionId: string, content: string, token: string) {
    return apiCall<any>(`/chat/${sessionId}/messages`, {
      method: 'POST',
      body: { content },
      token,
    });
  },
};

// Travel Service
export const travelService = {
  async generateItinerary(
    destination: string,
    startDate: string,
    endDate: string,
    preferences: Record<string, any> | undefined,
    token: string
  ) {
    return apiCall<any>('/travel/generate-itinerary', {
      method: 'POST',
      body: { destination, startDate, endDate, preferences },
      token,
    });
  },

  async updateItinerary(id: string, updates: Record<string, any>, token: string) {
    return apiCall<any>(`/travel/itineraries/${id}`, {
      method: 'PUT',
      body: { updates },
      token,
    });
  },

  async exportItinerary(id: string, format: 'pdf' | 'json', token: string) {
    return apiCall<any>(`/travel/itineraries/${id}/export?format=${format}`, {
      token,
    });
  },
};
