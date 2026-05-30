'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Plane,
  Plus,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Navigation,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';
import { useChat } from '@/lib/context/ChatContext';
import { useAuth } from '@/lib/context/AuthContext';

export default function Sidebar() {
  const {
    sessions,
    createSession,
    currentSession,
    setCurrentSession,
    loadSessions,
    deleteSession,
    updateSession,
  } = useChat();
  const { session: authSession, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleNewChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createSession(title);
      setTitle('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const user = authSession.user;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? '?');

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full overflow-hidden flex-shrink-0">

      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#0a1628] flex items-center justify-center rounded-lg flex-shrink-0 group-hover:bg-blue-700 transition-colors">
            <Plane className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-[0.25em] text-[#0a1628] uppercase">
              TravelAI
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
              <span className="text-[9px] text-slate-400 tracking-[0.12em] uppercase font-medium">
                System Online
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* New chat */}
      <div className="px-4 pt-4 pb-3">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 text-slate-500 hover:text-blue-700 text-sm font-medium transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:text-blue-600 transition-colors flex-shrink-0" strokeWidth={2} />
            <span className="tracking-wide">New Trip</span>
          </button>
        ) : (
          <form onSubmit={handleNewChat} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Paris 2025"
                className="w-full px-3.5 py-2.5 pr-9 border border-blue-300 rounded-lg text-sm bg-blue-50/40 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setIsCreating(false); setTitle(''); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-2 bg-[#0a1628] hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg tracking-wider uppercase transition"
            >
              Create
            </button>
          </form>
        )}
      </div>

      {/* Divider label */}
      <div className="flex items-center gap-2 px-4 mb-2">
        <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Recent Trips
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-0.5">
          {sessions.length === 0 ? (
            <div className="mx-1 mt-1 py-6 text-center border border-dashed border-slate-200 rounded-xl">
              <Navigation className="w-5 h-5 text-slate-300 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs text-slate-400 font-medium">No trips yet</p>
              <p className="text-[10px] text-slate-300 mt-0.5">Create one above to start</p>
            </div>
          ) : (
            sessions.map((session, index) => {
              const isActive = currentSession?.id === session.id;
              const isEditing = editingId === session.id;

              const startEdit = (e: React.MouseEvent) => {
                e.stopPropagation();
                setEditingId(session.id);
                setEditTitle(session.title);
                setTimeout(() => editInputRef.current?.focus(), 0);
              };

              const cancelEdit = (e?: React.MouseEvent) => {
                e?.stopPropagation();
                setEditingId(null);
                setEditTitle('');
              };

              const commitEdit = async (e?: React.MouseEvent) => {
                e?.stopPropagation();
                if (!editTitle.trim() || editTitle === session.title) {
                  cancelEdit();
                  return;
                }
                try {
                  await updateSession(session.id, editTitle.trim());
                } catch (err) {
                  console.error('Failed to rename session:', err);
                }
                setEditingId(null);
                setEditTitle('');
              };

              const handleDelete = async (e: React.MouseEvent) => {
                e.stopPropagation();
                try {
                  await deleteSession(session.id);
                } catch (err) {
                  console.error('Failed to delete session:', err);
                }
              };

              return (
                <div
                  key={`${session.id ?? 'session'}-${index}`}
                  className={`w-full text-left rounded-lg transition-all group flex items-start gap-2.5 border-l-2 ${
                    isActive
                      ? 'bg-blue-50 border-blue-600 text-[#0a1628]'
                      : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 w-full px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        ref={editInputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 min-w-0 text-sm px-2 py-1 rounded border border-blue-300 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={commitEdit}
                        className="text-emerald-500 hover:text-emerald-600 transition flex-shrink-0"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-slate-300 hover:text-slate-500 transition flex-shrink-0"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex items-start gap-2.5 flex-1 min-w-0 px-3 py-2.5"
                      onClick={() => setCurrentSession(session)}
                      title={session.title}
                    >
                      <MessageSquare
                        className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                        strokeWidth={1.5}
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm truncate leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                          {session.title}
                        </p>
                        <p className="text-[10px] mt-0.5 text-slate-400 tracking-wide">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                    </button>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-0.5 pr-2 pt-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={startEdit}
                        title="Rename"
                        className="p-1 rounded text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <button
                        onClick={handleDelete}
                        title="Delete"
                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-3 py-3 space-y-0.5">
        <Link
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all text-sm"
        >
          <Settings className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          <span className="tracking-wide">Settings</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all text-sm"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          <span className="tracking-wide">Help</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-[#0a1628] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 tracking-wider">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700 truncate leading-tight">
                {user.name ?? user.email}
              </p>
              {user.name && (
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              )}
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-slate-300 hover:text-red-400 transition flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
