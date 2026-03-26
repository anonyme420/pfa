'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChat } from '@/lib/context/ChatContext';

export default function Sidebar() {
  const { sessions, createSession, currentSession, setCurrentSession } = useChat();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createSession(title);
      setTitle('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">{/* Changed from h-screen to h-full */}
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/chat" className="text-lg font-bold text-blue-600">
          TravelAI
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            + New Chat
          </button>
        ) : (
          <form onSubmit={handleNewChat} className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Trip name (e.g., Paris 2024)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setTitle('');
                }}
                className="flex-1 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Recent Chats</h3>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-xs text-gray-400">No chats yet. Start one above!</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setCurrentSession(session)}
                className={`w-full text-left px-3 py-2 rounded-lg transition text-sm truncate ${
                  currentSession?.id === session.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={session.title}
              >
                {session.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          href="#"
          className="block text-sm text-gray-600 hover:text-gray-900"
        >
          Settings
        </Link>
        <Link
          href="#"
          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          Help & Support
        </Link>
      </div>
    </div>
  );
}
