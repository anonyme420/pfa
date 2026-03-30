'use client';

import { AuthProvider } from '@/lib/context/AuthContext';
import { ChatProvider } from '@/lib/context/ChatContext';
import { TravelProvider } from '@/lib/context/TravelContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <TravelProvider>{children}</TravelProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
