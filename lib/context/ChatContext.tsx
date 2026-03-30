'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { ChatSession, ChatMessage } from '../types';
import { chatService } from '../services/api';
import { useAuth } from './AuthContext';

interface ChatContextType {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  createSession: (title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<ChatMessage>;
  setCurrentSession: (session: ChatSession) => Promise<void>;
  loadSessions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSessionState] = useState<ChatSession | null>(null);
  const [sessions, setSessionsState] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session: authSession } = useAuth();

  const loadSessions = useCallback(async () => {
    if (!authSession.user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('travelai_token');
      if (!token) throw new Error('No auth token');

      const response = await chatService.listSessions(token);
      setSessionsState(response || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sessions';
      setError(message);
      console.error('Error loading sessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [authSession.user]);

  const createSession = useCallback(
    async (title: string) => {
      if (!authSession.user) throw new Error('Not authenticated');

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('travelai_token');
        if (!token) throw new Error('No auth token');

        const newSession = await chatService.createSession(title, token);
        setSessionsState((prev) => [newSession, ...prev]);
        setCurrentSessionState(newSession);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create session';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authSession.user]
  );

  const setCurrentSession = useCallback(async (session: ChatSession) => {
    if (!authSession.user) throw new Error('Not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('travelai_token');
      if (!token) throw new Error('No auth token');

      const fullSession = await chatService.getSession(session.id, token);
      setCurrentSessionState(fullSession);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load session';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authSession.user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentSession) throw new Error('No active session');
      if (!authSession.user) throw new Error('Not authenticated');

      setError(null);

      try {
        const token = localStorage.getItem('travelai_token');
        if (!token) throw new Error('No auth token');

        const response = await chatService.sendMessage(currentSession.id, content, token);
        
        // Update current session with new message
        setCurrentSessionState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), response],
            updatedAt: new Date().toISOString(),
          };
        });

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        throw err;
      }
    },
    [currentSession, authSession.user]
  );

  return (
    <ChatContext.Provider
      value={{
        currentSession,
        sessions,
        createSession,
        sendMessage,
        setCurrentSession,
        loadSessions,
        isLoading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
