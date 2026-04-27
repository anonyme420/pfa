'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import LoadingPlane from '@/components/LoadingPlane';

export default function ChatPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !session.isAuthenticated) {
      router.push('/auth/login');
    }
  }, [session.isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Show loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoading) {
    return <LoadingPlane />;
  }

  if (!session.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}