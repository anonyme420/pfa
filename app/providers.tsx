'use client';

import { AuthProvider } from '@/lib/context/AuthContext';
import { ChatProvider } from '@/lib/context/ChatContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>{children}</ChatProvider>
    </AuthProvider>
  );
}
