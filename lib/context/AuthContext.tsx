'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { User, AuthSession, AuthResponse } from '../types';
import { localAuthService } from '../services/auth';
import { authService } from '../services/api';

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
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize session from localStorage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localAuthService.getToken();

        if (token) {
          // Verify token with backend
          try {
            const user = await authService.getCurrentUser(token);
            setSession({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (tokenError) {
            // Token expired or invalid, try to refresh
            try {
              const refreshed = await authService.refresh(token);
              if (refreshed.access_token) {
                localAuthService.setToken(refreshed.access_token);
                setSession({
                  user: refreshed.user,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                throw new Error('Token refresh failed');
              }
            } catch (refreshError) {
              // Refresh failed, clear auth
              localAuthService.clearAuth();
              setSession({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }
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

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response: AuthResponse = await authService.login(email, password);

      localAuthService.setToken(response.access_token);
      localAuthService.setUser(response.user);

      setSession({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
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
        const response: AuthResponse = await authService.register(
          email,
          password,
          name
        );

        localAuthService.setToken(response.access_token);
        localAuthService.setUser(response.user);

        setSession({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
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
      const token = localAuthService.getToken();
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localAuthService.clearAuth();
      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
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
