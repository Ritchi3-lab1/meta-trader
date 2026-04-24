"use client";

import { useTradingStore } from "@/store/tradingStore";
import { formatCompactNumber, formatPrice } from "@/lib/utils";

export function MarketOverview() {
  const { assets, selectedAssetId, selectAsset } = useTradingStore();

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-700">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Markets
        </h2>
      </div>
      <div className="divide-y divide-neutral-700/50">
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => selectAsset(asset.id)}
            className={`w-full px-4 py-3 flex items-center justify-between transition-colors text-left hover:bg-neutral-700/50 ${
              selectedAssetId === asset.id ? "bg-neutral-700/80" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  asset.type === "crypto"
                    ? "bg-orange-500/20 text-orange-400"
                    : asset.type === "stock"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium text-white">{asset.symbol}</div>
                <div className="text-xs text-neutral-400">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-white">
                {formatPrice(asset.price, asset.type)}
              </div>
              <div
                className={`text-xs font-mono ${
                  asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {asset.change24h >= 0 ? "+" : ""}
                {asset.change24h.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
