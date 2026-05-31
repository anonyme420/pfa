'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Plane, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const displayError = error || (urlError ? 'Invalid email or password. Please try again.' : '');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Clear ?error= from the URL so re-submitting starts fresh
    if (urlError) {
      window.history.replaceState({}, '', '/auth/login');
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      // Full-page navigation so the browser sends the session cookie with the
      // first request to /chat — avoids the race condition with router.push.
      window.location.href = '/chat';
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ───────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] bg-[#0a1628] flex-col justify-center p-12 relative overflow-hidden gap-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-black tracking-[0.25em] text-white uppercase">
            TravelAI
          </span>
        </div>

        {/* Main copy */}
        <div className="relative space-y-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
              AI Navigator
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Navigate the World<br />With Intelligence.
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Your AI co-pilot handles flights, stays, activities, and full
            itineraries — tailored to your travel style.
          </p>
          <div className="space-y-3">
            {[
              'Personalized itineraries in minutes',
              'Real-time flight and hotel data',
              'Budget-aware recommendations',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <CheckCircle2
                  className="w-4 h-4 text-emerald-400 flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-[#0a1628] rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-black tracking-[0.25em] text-[#0a1628] uppercase">
              TravelAI
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#0a1628] tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to continue planning your trips.
            </p>
          </div>

          {displayError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition bg-white ${
                  displayError
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                    : 'border-slate-200 focus:border-blue-400 focus:ring-blue-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition bg-white ${
                    displayError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                      : 'border-slate-200 focus:border-blue-400 focus:ring-blue-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                    : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <Link href="#" className="text-xs text-blue-600 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0a1628] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 tracking-wide mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          

         

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-bold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}