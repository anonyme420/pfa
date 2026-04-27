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
  addMessage: (message: ChatMessage) => void;
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
      const response = await chatService.getSessions();
      setSessionsState(response.sessions || []);
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
        const response = await chatService.createSession(title);
        const newSession = response.session;
        const normalizedSession = { ...newSession, messages: newSession.messages ?? [] };
        setSessionsState((prev) => [normalizedSession, ...prev]);
        setCurrentSessionState(normalizedSession);
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
      const response = await chatService.getSession(session.id);
      const fullSession = response.session;
      setCurrentSessionState({ ...fullSession, messages: fullSession.messages ?? [] });
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
        const response = await chatService.sendMessage(currentSession.id, 'user', content);
        const newMessage = response.message;

        // Update current session with new message
        setCurrentSessionState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), newMessage],
            updatedAt: new Date().toISOString(),
          };
        });

        return newMessage;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        throw err;
      }
    },
    [currentSession, authSession.user]
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setCurrentSessionState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...(prev.messages || []), message],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentSession,
        sessions,
        createSession,
        sendMessage,
        addMessage,
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