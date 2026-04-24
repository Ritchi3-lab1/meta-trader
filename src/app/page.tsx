"use client";

import { useEffect } from "react";
import { useTradingStore } from "@/store/tradingStore";
import { Header } from "@/components/Header";
import { MarketOverview } from "@/components/MarketOverview";
import { PriceChart } from "@/components/PriceChart";
import { TradingPanel } from "@/components/TradingPanel";
import { Portfolio } from "@/components/Portfolio";

export default function Home() {
  const { generatePriceHistory, updatePrices, selectedAssetId, selectAsset } = useTradingStore();

  useEffect(() => {
    generatePriceHistory();
    const priceInterval = setInterval(() => {
      updatePrices();
    }, 3000);
    return () => clearInterval(priceInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generatePriceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssetId]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            TradingHub
          </h1>
          <p className="text-neutral-400 text-lg">
            Real-time cryptocurrency, stock, and forex trading platform
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Markets List */}
          <aside className="lg:col-span-3">
            <MarketOverview />
          </aside>

          {/* Center: Chart & Trade */}
          <main className="lg:col-span-6 space-y-6">
            <PriceChart />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TradingPanel />
              <Portfolio />
            </div>
          </main>

          {/* Right: Stats/Info */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Market Stats */}
            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                Market Stats
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">24h Volume</span>
                  <span className="text-white font-mono">$28.4B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Market Cap</span>
                  <span className="text-white font-mono">$1.32T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Dominance</span>
                  <span className="text-white font-mono">52.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Active Trades</span>
                  <span className="text-emerald-400 font-mono">1,247</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/50 p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Quick Tips</h3>
              <ul className="text-xs text-neutral-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Click any asset in Markets to view its chart
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Prices update every 3 seconds
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Orders execute immediately (market order simulation)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Leave price empty for market order
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
