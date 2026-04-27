// API Service - Central place for all backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
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
  const { method = 'GET', headers = {}, body } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

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

// Chat Service
export const chatService = {
  async getSessions() {
    return apiCall<any>('/chat/sessions', {
      method: 'GET',
    });
  },

  async createSession(title: string) {
    return apiCall<any>('/chat/sessions', {
      method: 'POST',
      body: { title },
    });
  },

  async getSession(sessionId: string) {
    return apiCall<any>(`/chat/sessions/${sessionId}`, {
      method: 'GET',
    });
  },

  async updateSession(sessionId: string, title: string) {
    return apiCall<any>(`/chat/sessions/${sessionId}`, {
      method: 'PUT',
      body: { title },
    });
  },

  async deleteSession(sessionId: string) {
    return apiCall<any>(`/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  async getMessages(sessionId: string) {
    return apiCall<any>(`/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
    });
  },

  async sendMessage(sessionId: string, role: string, content: string, metadata?: any) {
    return apiCall<any>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: { role, content, metadata },
    });
  },
};
