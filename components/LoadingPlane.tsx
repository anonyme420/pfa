'use client';

import { Plane } from 'lucide-react';

export default function LoadingPlane() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
      {/* Full width flight path line */}
      <div className="absolute top-1/3 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      {/* Flying plane - full width animation */}
      <div className="absolute top-1/3 transform -translate-y-1/2 animate-fly-plane-full-width">
        <Plane className="w-16 h-16 text-black drop-shadow-lg rotate-45" strokeWidth={1.5} />
      </div>

      {/* Loading text at bottom */}
      <div className="absolute bottom-20 flex flex-col items-center justify-center">
        <p className="text-lg font-semibold text-slate-700 mb-3">Preparing your journey...</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fly-plane-full-width {
          0% {
            left: -80px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: calc(100vw + 80px);
            opacity: 0;
          }
        }

        .animate-fly-plane-full-width {
          animation: fly-plane-full-width 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
