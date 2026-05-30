import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/auth';
import {
  Plane,
  Route,
  Building2,
  CreditCard,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const FEATURES = [
  {
    Icon: Plane,
    color: 'bg-sky-100 text-sky-700',
    title: 'Smart Flight Search',
    desc: 'Personalized recommendations across all major airlines with live price comparisons.',
  },
  {
    Icon: Building2,
    color: 'bg-violet-100 text-violet-700',
    title: 'Accommodation Matching',
    desc: 'Hotels, boutique stays, and hidden gems matched to your preferences and budget.',
  },
  {
    Icon: Route,
    color: 'bg-blue-100 text-blue-700',
    title: 'AI Itinerary Builder',
    desc: 'Detailed day-by-day plans with activities, restaurants, and attractions curated for you.',
  },
  {
    Icon: CreditCard,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Budget Intelligence',
    desc: 'Transparent cost breakdowns and smart spending optimization without sacrificing quality.',
  },
  {
    Icon: Zap,
    color: 'bg-amber-100 text-amber-700',
    title: 'Real-Time Updates',
    desc: 'Live flight prices, availability changes, and local events integrated into your plan.',
  },
  {
    Icon: Globe,
    color: 'bg-rose-100 text-rose-700',
    title: 'Multi-City Planning',
    desc: 'Complex multi-destination itineraries handled seamlessly with optimal routing.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Set Your Destination',
    desc: 'Tell your AI navigator where you want to go, your travel dates, and your travel style.',
  },
  {
    n: '02',
    title: 'Define Your Style',
    desc: 'Share your budget, interests, and preferences. The more detail, the better the plan.',
  },
  {
    n: '03',
    title: 'AI Builds Your Plan',
    desc: 'Your intelligent co-pilot analyzes data and generates a perfect personalized itinerary.',
  },
  {
    n: '04',
    title: 'Book and Explore',
    desc: 'Confirm bookings through integrated partners and take off with complete confidence.',
  },
];

export default async function HomePage() {
  const session = await auth();
  const planningHref = session?.user ? '/chat' : '/auth/signup';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1dce8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/80 pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              AI Travel Navigator — Online
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#0a1628] tracking-tight leading-[1.05] mb-6">
            Plan Smarter.<br />
            <span className="text-blue-600">Travel Further.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Your AI co-pilot for every destination. From flights to full itineraries —
            personalized, precise, and ready in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href={planningHref}
              className="flex items-center gap-2 px-7 py-3.5 bg-[#0a1628] text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-slate-900/20 tracking-wide"
            >
              Start Planning
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 border border-slate-200 bg-white text-[#0a1628] text-sm font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all tracking-wide"
            >
              Explore Features
            </Link>
          </div>

        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase mb-3">
              Capabilities
            </p>
            <h2 className="text-4xl font-black text-[#0a1628] tracking-tight">
              Everything Your Trip Needs
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-lg mx-auto leading-relaxed">
              From first search to final booking — your AI handles every detail.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase mb-3">
              Mission Briefing
            </p>
            <h2 className="text-4xl font-black text-[#0a1628] tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-md mx-auto">
              Four steps from idea to adventure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="flex gap-5 p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-black text-white tracking-wider">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1628] mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a1628]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase mb-4">
            Ready for Takeoff
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Your Next Adventure Awaits
          </h2>
          <p className="text-slate-400 mb-10 text-base leading-relaxed max-w-lg mx-auto">
            Join thousands of travelers planning smarter trips with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={planningHref}
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-[#0a1628] text-sm font-bold rounded-xl hover:bg-slate-100 transition-all tracking-wide shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2} />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
