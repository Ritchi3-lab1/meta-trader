"use client";

import { useTradingStore } from "@/store/tradingStore";
import { formatPrice } from "@/lib/utils";

export function PriceChart() {
  const { priceHistory, selectedAssetId, assets } = useTradingStore();
  const asset = assets.find((a) => a.id === selectedAssetId);

  if (!asset || priceHistory.length === 0) return null;

  const prices = priceHistory.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const width = 600;
  const height = 300;
  const padding = 20;

  // Generate path for line chart
  const points = priceHistory.map((point, i) => {
    const x = (i / (priceHistory.length - 1)) * (width - 2 * padding) + padding;
    const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  const isPositive = asset.change24h >= 0;
  const lineColor = isPositive ? "#10b981" : "#ef4444";
  const gradientId = "gradient";

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{asset.symbol}/USD</h2>
          <p className="text-sm text-neutral-400">{asset.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-white">{formatPrice(asset.price, asset.type)}</div>
          <div className={`text-sm font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: "300px" }}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + ((height - 2 * padding) * i) / 4;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill={`url(#${gradientId})`}
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current price dot */}
          {(() => {
            const lastX = width - padding;
            const lastY = height - padding - ((prices[prices.length - 1] - minPrice) / priceRange) * (height - 2 * padding);
            return (
              <circle cx={lastX} cy={lastY} r="4" fill={lineColor}>
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </circle>
            );
          })()}
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-xs text-neutral-500 font-mono">
        <span>{minPrice.toFixed(asset.type === "forex" ? 4 : 2)}</span>
        <span>{maxPrice.toFixed(asset.type === "forex" ? 4 : 2)}</span>
      </div>
    </div>
  );
}
