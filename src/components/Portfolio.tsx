"use client";

import { useTradingStore } from "@/store/tradingStore";
import { formatCompactNumber, formatPrice, formatQuantity } from "@/lib/utils";

export function Portfolio() {
  const { assets, positions, trades } = useTradingStore();

  const positionsWithValue = positions.map((pos) => {
    const asset = assets.find((a) => a.id === pos.assetId);
    if (!asset) return null;
    const currentValue = pos.quantity * asset.price;
    const costBasis = pos.quantity * pos.avgPrice;
    const pl = currentValue - costBasis;
    const plPercent = ((asset.price - pos.avgPrice) / pos.avgPrice) * 100;

    return {
      ...pos,
      asset,
      currentValue,
      costBasis,
      pl,
      plPercent,
    };
  }).filter(Boolean);

  const totalValue = positionsWithValue.reduce((sum, p) => sum + (p?.currentValue || 0), 0);
  const totalPl = positionsWithValue.reduce((sum, p) => sum + (p?.pl || 0), 0);

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Portfolio
        </h2>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-neutral-500">Value: </span>
            <span className="text-white font-mono">${formatCompactNumber(totalValue)}</span>
          </div>
          <div className={totalPl >= 0 ? "text-emerald-400" : "text-red-400"}>
            {totalPl >= 0 ? "+" : ""}{formatCompactNumber(totalPl)}
          </div>
        </div>
      </div>

      {positionsWithValue.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          No positions yet. Buy your first asset!
        </div>
      ) : (
        <div className="divide-y divide-neutral-700/50">
          {positionsWithValue.map((pos) => (
            pos && (
              <div key={pos.assetId} className="px-4 py-3 hover:bg-neutral-700/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      pos.asset.type === "crypto"
                        ? "bg-orange-500/20 text-orange-400"
                        : pos.asset.type === "stock"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {pos.asset.symbol.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{pos.asset.symbol}</div>
                    <div className="text-xs text-neutral-400">{pos.asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{formatQuantity(pos.quantity)}</div>
                    <div className="text-xs text-neutral-400">
                      @ {formatPrice(pos.avgPrice, pos.asset.type)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center ml-11">
                  <div className="text-sm">
                    <span className="text-neutral-500">Value: </span>
                    <span className="text-white">${formatCompactNumber(pos.currentValue)}</span>
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      pos.pl >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pos.pl >= 0 ? "+" : ""}${formatCompactNumber(pos.pl)} ({pos.plPercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Recent Trades */}
      <div className="px-4 py-3 border-t border-neutral-700">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-3">
          Recent Trades
        </h3>
        {trades.length === 0 ? (
          <div className="text-sm text-neutral-500">No trades yet</div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trades.slice(0, 5).map((trade) => {
              const asset = assets.find((a) => a.id === trade.assetId);
              return (
                <div key={trade.id} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        trade.type === "buy" ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span className={trade.type === "buy" ? "text-emerald-400" : "text-red-400"}>
                      {trade.type.toUpperCase()}
                    </span>
                    <span className="text-neutral-300">
                      {asset?.symbol} × {formatQuantity(trade.quantity)}
                    </span>
                  </div>
                  <span className="text-neutral-400 text-xs">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
