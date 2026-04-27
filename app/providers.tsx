'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ChatProvider } from '@/lib/context/ChatContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ChatProvider>{children}</ChatProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
