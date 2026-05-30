'use client';

import Link from 'next/link';
import { Plane, ChevronDown, LogOut, User, Map } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const user = session.user;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? 'U');

  const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#' },
    ...(session.isAuthenticated ? [{ label: 'Plan Trip', href: '/chat' }] : []),
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-[#0a1628] rounded-lg flex items-center justify-center group-hover:bg-blue-800 transition-colors">
              <Plane className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-black tracking-[0.25em] text-[#0a1628] uppercase">
              TravelAI
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:text-[#0a1628] hover:bg-slate-50 rounded-lg transition-all tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {session.isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-[#0a1628] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.name ?? user.email}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name ?? 'Traveler'}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="#"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                          Profile Settings
                        </Link>
                        <Link
                          href="/chat"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                        >
                          <Map className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                          My Trips
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={1.5} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0a1628] hover:bg-slate-50 rounded-lg transition-all tracking-wide"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-1.5 text-sm font-semibold bg-[#0a1628] text-white rounded-lg hover:bg-blue-800 transition-all tracking-wide"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
