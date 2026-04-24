"use client";

import { useTradingStore } from "@/store/tradingStore";
import { formatPrice } from "@/lib/utils";

export function TradingPanel() {
  const {
    selectedAssetId,
    assets,
    orderType,
    orderQuantity,
    orderPrice,
    positions,
    setOrderType,
    setOrderQuantity,
    setOrderPrice,
    placeOrder,
  } = useTradingStore();

  const asset = assets.find((a) => a.id === selectedAssetId);
  const position = positions.find((p) => p.assetId === selectedAssetId);

  if (!asset) return null;

  const totalValue = (parseFloat(orderQuantity) || 0) * (parseFloat(orderPrice) || asset.price);
  const availableBalance = 25000.50; // Simulated balance

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Trade</h2>

      {/* Order Type Tabs */}
      <div className="flex rounded-lg bg-neutral-700 p-1 mb-4">
        <button
          onClick={() => setOrderType("buy")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            orderType === "buy"
              ? "bg-emerald-600 text-white shadow-lg"
              : "text-neutral-300 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setOrderType("sell")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            orderType === "sell"
              ? "bg-red-600 text-white shadow-lg"
              : "text-neutral-300 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Asset Info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-700/50 mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
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
          <div className="font-semibold text-white">{asset.symbol}</div>
          <div className="text-xs text-neutral-400">{asset.name}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-mono text-white">{formatPrice(asset.price, asset.type)}</div>
          <div className={`text-xs font-mono ${asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Quantity</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Price {orderPrice ? "(Limit)" : "(Market)"}
          </label>
          <input
            type="number"
            step={asset.type === "forex" ? "0.0001" : "0.01"}
            min="0"
            value={orderPrice}
            onChange={(e) => setOrderPrice(e.target.value)}
            placeholder={orderPrice ? "" : "Market"}
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {!orderPrice && (
            <p className="text-xs text-neutral-500 mt-1">Market price: {formatPrice(asset.price, asset.type)}</p>
          )}
        </div>

        <div className="border-t border-neutral-700 pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-400">Estimated Total</span>
            <span className="font-mono text-white">
              {formatPrice(totalValue, "stock")}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-neutral-400">Available Balance</span>
            <span className="font-mono text-white">${availableBalance.toLocaleString()}</span>
          </div>
        </div>

        {position && (
          <div className="p-3 rounded-lg bg-neutral-700/50 text-sm">
            <div className="text-neutral-400 mb-1">Your Position</div>
            <div className="flex justify-between">
              <span className="text-white">{position.quantity} {asset.symbol}</span>
              <span className="text-neutral-300">@ {formatPrice(position.avgPrice, asset.type)}</span>
            </div>
          </div>
        )}

        <button
          onClick={placeOrder}
          disabled={!orderQuantity || parseFloat(orderQuantity) <= 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            orderType === "buy"
              ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-neutral-700 disabled:text-neutral-500"
              : "bg-red-600 hover:bg-red-500 text-white disabled:bg-neutral-700 disabled:text-neutral-500"
          }`}
        >
          {orderType === "buy" ? "Buy" : "Sell"} {asset.symbol}
        </button>
      </div>
    </div>
  );
}
