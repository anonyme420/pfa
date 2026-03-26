'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, AuthSession } from '../types';
import { localAuthService } from '../services/auth';
import { authService } from '../services/api';

interface AuthContextType {
  session: AuthSession;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localAuthService.getToken();
        const user = localAuthService.getUser();

        if (token && user) {
          // TODO: Verify token with backend when ready
          setSession({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setSession({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setSession({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      // TODO: Implement actual login
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock_token_' + Date.now();

      localAuthService.setToken(mockToken);
      localAuthService.setUser(mockUser);

      setSession({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      // TODO: Implement actual registration
      const mockUser: User = {
        id: Math.random().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock_token_' + Date.now();

      localAuthService.setToken(mockToken);
      localAuthService.setUser(mockUser);

      setSession({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      // TODO: Call backend logout endpoint when ready
      localAuthService.clearAuth();

      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        register,
        logout,
        isLoading: session.isLoading,
        error,
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
