'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Plane, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, name);
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create account.';
      setError(msg === 'User already exists'
        ? 'An account with this email already exists. Try signing in instead.'
        : msg);
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
              Join the Mission
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Start Your Journey<br />Today.
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Create your free account and let AI plan your perfect trip —
            from destination research to day-by-day itineraries.
          </p>
          <div className="space-y-3">
            {[
              'Free to use — no credit card needed',
              'Your data stays private and secure',
              'Trips ready in under 2 minutes',
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
              Create your account
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Free forever. No credit card required.
            </p>
          </div>

          {success && (
            <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              <span>Account created! Redirecting to sign in…</span>
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition bg-white"
              />
            </div>

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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition bg-white"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition bg-white"
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

            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition bg-white"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer pt-1">
              <input type="checkbox" required className="mt-0.5 rounded border-slate-300 flex-shrink-0" />
              <span>
                I agree to the{' '}
                <Link href="#" className="text-blue-600 hover:underline font-semibold">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0a1628] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 tracking-wide mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] text-slate-400 tracking-wide uppercase font-medium">
              Or sign up with
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'GitHub'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition tracking-wide"
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
