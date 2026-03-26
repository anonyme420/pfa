'use client';

import { Plane } from 'lucide-react';

export default function InlineLoadingPlane() {
  return (
    <div className="flex gap-3 max-w-xl">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
        AI
      </div>
      <div className="bg-gray-100 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
        <div className="flex gap-2 items-center">
          <Plane className="w-4 h-4 text-blue-600 animate-bounce" />
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
