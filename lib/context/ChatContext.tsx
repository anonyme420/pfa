'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { ChatSession, ChatMessage } from '../types';

interface ChatContextType {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  createSession: (title: string) => void;
  addMessage: (message: ChatMessage) => void;
  setCurrentSession: (session: ChatSession) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = (title: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions([newSession, ...sessions]);
    setCurrentSession(newSession);
  };

  const addMessage = (message: ChatMessage) => {
    setCurrentSession((prevSession) => {
      if (!prevSession) return prevSession;

      const updatedSession: ChatSession = {
        ...prevSession,
        messages: [...prevSession.messages, message],
        updatedAt: new Date().toISOString(),
      };

      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === prevSession.id ? updatedSession : s
        )
      );

      return updatedSession;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentSession,
        sessions,
        createSession,
        addMessage,
        setCurrentSession,
        isLoading,
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
