'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletAsset } from '@/lib/portfolioService';

// Map symbol -> màu chủ đạo và icon
const COIN_META: Record<string, { color: string; icon: string; name: string }> = {
  BTC: { color: '#f7931a', icon: 'currency_bitcoin', name: 'Bitcoin' },
  ETH: { color: '#627eea', icon: 'eco', name: 'Ethereum' },
  BNB: { color: '#f0b90b', icon: 'token', name: 'Binance Coin' },
  SOL: { color: '#9945ff', icon: 'bolt', name: 'Solana' },
  XRP: { color: '#00aae4', icon: 'water', name: 'Ripple' },
  ADA: { color: '#0d1e2d', icon: 'hexagon', name: 'Cardano' },
  DOGE: { color: '#c2a633', icon: 'pets', name: 'Dogecoin' },
};

// Default fallback cho coin bất kỳ
const DEFAULT_COIN_META = { color: '#59f8a9', icon: 'monetization_on', name: '' };

export interface LivePrices {
  [symbol: string]: { price: number; change_24h: number };
}

interface HoldingRowProps {
  holding: WalletAsset;
  livePrice: number;
  change24h: number;
  onRemove: (symbol: string) => void;
}

const HoldingRow: React.FC<HoldingRowProps> = ({ holding, livePrice, change24h, onRemove }) => {
  const meta = COIN_META[holding.coin_symbol] ?? { ...DEFAULT_COIN_META, name: holding.coin_symbol };

  // Tính P/L bằng useMemo — chỉ tính lại khi giá hoặc holdings thay đổi
  const pl = useMemo(
    () => (livePrice - holding.average_buy_price) * holding.amount,
    [livePrice, holding.average_buy_price, holding.amount]
  );

  const plPercent = useMemo(
    () => holding.average_buy_price > 0
      ? ((livePrice - holding.average_buy_price) / holding.average_buy_price) * 100
      : 0,
    [livePrice, holding.average_buy_price]
  );

  const totalValue = useMemo(
    () => livePrice * holding.amount,
    [livePrice, holding.amount]
  );

  const isProfit = pl >= 0;
  const plColor = isProfit ? '#59f8a9' : '#ffb4ab';

  return (
    <tr className="hover:bg-[#272a2e]/40 transition-colors group">
      {/* Asset */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner"
            style={{ background: meta.color + '22', border: `1px solid ${meta.color}44` }}
          >
            <span className="material-symbols-outlined text-lg" style={{ color: meta.color }}>{meta.icon}</span>
          </div>
          <div>
            <p className="font-bold text-[#e1e2e7] leading-none">{holding.coin_symbol}</p>
            <p className="text-[10px] text-[#c1c7d1] mt-1">{meta.name || holding.coin_symbol}</p>
          </div>
        </div>
      </td>

      {/* Balance */}
      <td className="px-5 py-4">
        <p className="font-bold text-[#e1e2e7]">
          {Number(holding.amount).toFixed(5)}</p>
        <p className="text-[10px] text-[#c1c7d1] mt-1">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </td>

      {/* Avg Price */}
      <td className="px-5 py-4 hidden md:table-cell text-[#d3c5ac] font-medium">
        ${holding.average_buy_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>

      {/* Live Price + P/L (animated) */}
      <td className="px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={livePrice}
            initial={{ color: livePrice > 0 ? plColor : '#e1e2e7', scale: 1.08 }}
            animate={{ color: '#e1e2e7', scale: 1 }}
            transition={{ duration: 0.7 }}
            className="font-bold text-sm"
          >
            ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </motion.p>
        </AnimatePresence>

        {/* 24h change */}
        <p className={`text-[10px] font-medium mt-0.5 ${change24h >= 0 ? 'text-[#59f8a9]' : 'text-[#ffb4ab]'}`}>
          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
        </p>

        {/* P/L */}
        <div className="flex items-center gap-1 mt-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={pl}
              initial={{ color: plColor, y: isProfit ? -3 : 3 }}
              animate={{ color: plColor, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-bold"
            >
              P/L: {isProfit ? '+' : ''}${pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {' '}({isProfit ? '+' : ''}{plPercent.toFixed(2)}%)
            </motion.span>
          </AnimatePresence>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right">
        <button
          onClick={() => onRemove(holding.coin_symbol)}
          className="p-1.5 rounded-lg text-[#d3c5ac] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all opacity-0 group-hover:opacity-100"
          title="Xóa"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    </tr>
  );
};

interface HoldingsTableProps {
  portfolio: WalletAsset[];
  livePrices: LivePrices;
  onRemove: (symbol: string) => void;
  loading: boolean;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ portfolio, livePrices, onRemove, loading }) => {
  return (
    <section className="bg-[#191c1f] rounded-xl overflow-hidden border border-[#4f4633]/10">
      <div className="p-5 flex justify-between items-center border-b border-[#4f4633]/5">
        <h2 className="text-lg font-bold tracking-tight text-[#e1e2e7]">Active Holdings</h2>
        <span className="text-xs text-[#d3c5ac]">{portfolio.length} tài sản</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0b0e11]/50">
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Asset</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Balance</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest hidden md:table-cell">Giá Mua TB</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Giá Live & P/L</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest text-right">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4f4633]/5">
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#d3c5ac] text-sm animate-pulse">
                  Đang tải danh mục...
                </td>
              </tr>
            )}
            {!loading && portfolio.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#d3c5ac] text-sm">
                  Chưa có tài sản nào. Nhấn nút <span className="text-[#f0b90b] font-bold">+</span> để thêm coin!
                </td>
              </tr>
            )}
            {portfolio.map(h => (
              <HoldingRow
                key={h.coin_symbol}
                holding={h}
                livePrice={livePrices[h.coin_symbol]?.price ?? h.average_buy_price}
                change24h={livePrices[h.coin_symbol]?.change_24h ?? 0}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HoldingsTable;
