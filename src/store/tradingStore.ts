import { create } from "zustand";

export type AssetType = "crypto" | "stock" | "forex";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface Order {
  id: string;
  assetId: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  timestamp: Date;
}

export interface Trade {
  id: string;
  assetId: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  timestamp: Date;
}

export interface Position {
  assetId: string;
  quantity: number;
  avgPrice: number;
}

interface TradingState {
  // Market data
  assets: Asset[];
  selectedAssetId: string;
  priceHistory: { time: Date; price: number }[];

  // Trading
  orders: Order[];
  trades: Trade[];
  positions: Position[];

  // UI state
  orderType: "buy" | "sell";
  orderQuantity: string;
  orderPrice: string;

  // Actions
  selectAsset: (id: string) => void;
  setOrderType: (type: "buy" | "sell") => void;
  setOrderQuantity: (qty: string) => void;
  setOrderPrice: (price: string) => void;
  placeOrder: () => void;
  updatePrices: () => void;
  generatePriceHistory: () => void;
}

const generatePriceHistoryForAsset = (currentPrice: number) => {
  const now = new Date();
  const history: { time: Date; price: number }[] = [];
  let price = currentPrice * 0.95;

  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const volatility = 0.002;
    const change = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + change);
    history.push({ time, price: Math.max(price, currentPrice * 0.8) });
  }

  history[history.length - 1].price = currentPrice;
  return history;
};

export const useTradingStore = create<TradingState>((set, get) => ({
  // Initial state
  assets: [
    {
      id: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      type: "crypto",
      price: 67234.50,
      change24h: 2.34,
      volume24h: 28400000000,
      high24h: 68900.00,
      low24h: 65420.00,
    },
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      type: "crypto",
      price: 3456.78,
      change24h: -1.23,
      volume24h: 15600000000,
      high24h: 3520.00,
      low24h: 3380.00,
    },
    {
      id: "sol",
      symbol: "SOL",
      name: "Solana",
      type: "crypto",
      price: 178.90,
      change24h: 5.67,
      volume24h: 4200000000,
      high24h: 185.00,
      low24h: 168.00,
    },
    {
      id: "aapl",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "stock",
      price: 178.45,
      change24h: 0.89,
      volume24h: 52000000,
      high24h: 180.20,
      low24h: 176.10,
    },
    {
      id: "tsla",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "stock",
      price: 245.30,
      change24h: -2.15,
      volume24h: 98000000,
      high24h: 252.80,
      low24h: 243.50,
    },
    {
      id: "eurusd",
      symbol: "EUR/USD",
      name: "Euro / US Dollar",
      type: "forex",
      price: 1.0854,
      change24h: 0.12,
      volume24h: 0,
      high24h: 0,
      low24h: 0,
    },
  ],
  selectedAssetId: "btc",
  priceHistory: [],

  orders: [],
  trades: [],
  positions: [
    { assetId: "btc", quantity: 0.5, avgPrice: 65000 },
    { assetId: "eth", quantity: 2.5, avgPrice: 3200 },
  ],

  orderType: "buy",
  orderQuantity: "",
  orderPrice: "",

  selectAsset: (id) => {
    const asset = get().assets.find((a) => a.id === id);
    if (asset) {
      const history = generatePriceHistoryForAsset(asset.price);
      set({ selectedAssetId: id, priceHistory: history });
    }
  },

  setOrderType: (type) => set({ orderType: type }),
  setOrderQuantity: (qty) => set({ orderQuantity: qty }),
  setOrderPrice: (price) => set({ orderPrice: price }),

  placeOrder: () => {
    const { selectedAssetId, orderType, orderQuantity, orderPrice, assets, orders, positions } = get();
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    const qty = parseFloat(orderQuantity);
    const price = orderPrice ? parseFloat(orderPrice) : asset.price;

    if (isNaN(qty) || qty <= 0) return;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      assetId: selectedAssetId,
      type: orderType,
      price,
      quantity: qty,
      timestamp: new Date(),
    };

    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      assetId: selectedAssetId,
      type: orderType,
      price,
      quantity: qty,
      timestamp: new Date(),
    };

    const existingPos = positions.find((p) => p.assetId === selectedAssetId);
    let newPositions: Position[];

    if (existingPos) {
      const totalValue = existingPos.quantity * existingPos.avgPrice;
      if (orderType === "buy") {
        const newQty = existingPos.quantity + qty;
        const newTotalValue = totalValue + qty * price;
        newPositions = positions.map((p) =>
          p.assetId === selectedAssetId
            ? { ...p, quantity: newQty, avgPrice: newTotalValue / newQty }
            : p
        );
      } else {
        const newQty = existingPos.quantity - qty;
        if (newQty <= 0) {
          newPositions = positions.filter((p) => p.assetId !== selectedAssetId);
        } else {
          newPositions = positions.map((p) =>
            p.assetId === selectedAssetId ? { ...p, quantity: newQty } : p
        );
        }
      }
    } else if (orderType === "buy") {
      newPositions = [...positions, { assetId: selectedAssetId, quantity: qty, avgPrice: price }];
    } else {
      newPositions = positions;
    }

    set({
      orders: [...orders, newOrder],
      trades: [newTrade, ...get().trades],
      positions: newPositions,
      orderQuantity: "",
      orderPrice: "",
    });
  },

  updatePrices: () => {
    set((state) => ({
      assets: state.assets.map((asset) => {
        const volatility = asset.type === "crypto" ? 0.002 : 0.0005;
        const change = (Math.random() - 0.5) * 2 * volatility;
        const newPrice = asset.price * (1 + change);
        const change24h = asset.change24h + (Math.random() - 0.5) * 0.1;

        return {
          ...asset,
          price: newPrice,
          change24h,
          high24h: Math.max(asset.high24h, newPrice),
          low24h: asset.low24h === 0 ? newPrice : Math.min(asset.low24h, newPrice),
        };
      }),
    }));
  },

  generatePriceHistory: () => {
    const asset = get().assets.find((a) => a.id === get().selectedAssetId);
    if (asset) {
      const history = generatePriceHistoryForAsset(asset.price);
      set({ priceHistory: history });
    }
  },
}));
