'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { TravelItinerary } from '../types';
import { travelService } from '../services/api';
import { useAuth } from './AuthContext';

interface TravelContextType {
  itinerary: TravelItinerary | null;
  itineraries: TravelItinerary[];
  generateItinerary: (
    destination: string,
    startDate: string,
    endDate: string,
    preferences?: Record<string, any>
  ) => Promise<TravelItinerary>;
  updateItinerary: (id: string, updates: Record<string, any>) => Promise<TravelItinerary>;
  exportItinerary: (id: string, format: 'pdf' | 'json') => Promise<Blob>;
  setCurrentItinerary: (itinerary: TravelItinerary | null) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export function TravelProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [itineraries, setItineraries] = useState<TravelItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session: authSession } = useAuth();

  const generateItinerary = useCallback(
    async (
      destination: string,
      startDate: string,
      endDate: string,
      preferences?: Record<string, any>
    ) => {
      if (!authSession.user) throw new Error('Not authenticated');

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('travelai_token');
        if (!token) throw new Error('No auth token');

        const newItinerary = await travelService.generateItinerary(
          destination,
          startDate,
          endDate,
          preferences,
          token
        );

        setItineraries((prev) => [newItinerary, ...prev]);
        setItinerary(newItinerary);
        return newItinerary;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate itinerary';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authSession.user]
  );

  const updateItinerary = useCallback(
    async (id: string, updates: Record<string, any>) => {
      if (!authSession.user) throw new Error('Not authenticated');

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('travelai_token');
        if (!token) throw new Error('No auth token');

        const updated = await travelService.updateItinerary(id, updates, token);

        setItineraries((prev) =>
          prev.map((itin) => (itin.id === id ? updated : itin))
        );

        if (itinerary?.id === id) {
          setItinerary(updated);
        }

        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update itinerary';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [itinerary, authSession.user]
  );

  const exportItinerary = useCallback(
    async (id: string, format: 'pdf' | 'json'): Promise<Blob> => {
      if (!authSession.user) throw new Error('Not authenticated');

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('travelai_token');
        if (!token) throw new Error('No auth token');

        // Note: This will need special handling for blob downloads
        // The travelService should return a blob instead of JSON
        const response = await travelService.exportItinerary(id, format, token);
        return response as unknown as Blob;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to export itinerary';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authSession.user]
  );

  const setCurrentItinerary = useCallback((itin: TravelItinerary | null) => {
    setItinerary(itin);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TravelContext.Provider
      value={{
        itinerary,
        itineraries,
        generateItinerary,
        updateItinerary,
        exportItinerary,
        setCurrentItinerary,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within TravelProvider');
  }
  return context;
}
