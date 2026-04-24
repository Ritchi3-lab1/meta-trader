"use client";

import { useTradingStore } from "@/store/tradingStore";

export function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TH</span>
            </div>
            <span className="text-lg font-semibold text-white">TradingHub</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-neutral-300 hover:text-white transition-colors">Markets</a>
            <a href="#" className="text-emerald-400 font-medium">Trade</a>
            <a href="#" className="text-neutral-300 hover:text-white transition-colors">Portfolio</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              <span className="text-emerald-400 font-semibold">Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              <span className="text-sm text-neutral-300">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
