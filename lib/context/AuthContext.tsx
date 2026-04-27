'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { authService } from '../services/auth';
import { User, AuthSession } from '../types';

interface AuthContextType {
  session: AuthSession;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: nextAuthSession, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  // Map NextAuth session to our session format
  const session: AuthSession = {
    user: nextAuthSession?.user as User | null,
    isAuthenticated: !!nextAuthSession?.user,
    isLoading: status === 'loading',
  };

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await authService.login(email, password);
      // NextAuth will handle session update automatically
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      setError(null);
      try {
        await authService.register(email, password, name);
        // After registration, user can login
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        register,
        logout,
        isLoading: session.isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
