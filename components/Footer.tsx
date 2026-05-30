'use client';

import Link from 'next/link';
import { Plane } from 'lucide-react';

const LINKS: Record<string, string[]> = {
  Product: ['Features', 'Pricing', 'FAQ', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-[#0a1628] rounded-lg flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-black tracking-[0.25em] text-[#0a1628] uppercase">
                TravelAI
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              AI-powered travel planning. Perfect trips in minutes, not hours.
            </p>
            <div className="flex gap-4 mt-5">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-[11px] text-slate-400 hover:text-slate-700 transition font-medium tracking-wide"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-800 transition"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-slate-400 tracking-wide">
            &copy; {new Date().getFullYear()} TravelAI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
            <span className="text-[10px] text-slate-400 tracking-wide uppercase font-medium">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
