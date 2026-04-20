'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletAsset } from '@/lib/portfolioService';
import { LivePrices } from './HoldingsTable';

interface PortfolioSummaryProps {
  portfolio: WalletAsset[];
  livePrices: LivePrices;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio, livePrices }) => {
  // Tổng giá trị hiện tại
  const totalValue = useMemo(() =>
    portfolio.reduce((sum, w) => {
      const livePrice = livePrices[w.coin_symbol]?.price ?? w.average_buy_price;
      return sum + livePrice * w.amount;
    }, 0),
    [portfolio, livePrices]
  );

  // Tổng tiền đã đầu tư
  const totalInvested = useMemo(() =>
    portfolio.reduce((sum, w) => sum + w.average_buy_price * w.amount, 0),
    [portfolio]
  );

  // Tổng P/L
  const totalPL = useMemo(() => totalValue - totalInvested, [totalValue, totalInvested]);
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
  const isProfit = totalPL >= 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Net Worth Display */}
      <div className="md:col-span-2 p-6 rounded-xl bg-[#191c1f] border border-[#4f4633]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] opacity-5 blur-3xl rounded-full -mr-16 -mt-16" />
        <p className="text-[#d3c5ac] text-sm font-medium tracking-wide uppercase mb-2">Net Worth Portfolio</p>
        <motion.h1
          animate={{ opacity: [0.7, 1] }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#e1e2e7] mb-2"
        >
          {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
          <span className="text-[#f0b90b] text-2xl">USDT</span>
        </motion.h1>
        <p className="text-[#c1c7d1] text-sm mb-1">
          Tổng đã đầu tư:{' '}
          <span className="font-semibold text-[#e1e2e7]">
            ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Total PnL */}
        <div className="p-5 rounded-xl bg-[#191c1f] border border-[#4f4633]/10">
          <p className="text-[#d3c5ac] text-xs font-bold uppercase tracking-widest mb-1">Total PnL</p>
          <div className="flex items-end justify-between">
            <motion.span
              animate={{ color: isProfit ? '#59f8a9' : '#ffb4ab' }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-bold"
            >
              {isProfit ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
            <span
              className="text-sm font-bold px-2 py-0.5 rounded"
              style={{
                background: isProfit ? 'rgba(89,248,169,0.1)' : 'rgba(255,180,171,0.1)',
                color: isProfit ? '#59f8a9' : '#ffb4ab',
              }}
            >
              {isProfit ? '+' : ''}{totalPLPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Số coin đang nắm */}
        <div className="p-5 rounded-xl bg-[#191c1f] border border-[#4f4633]/10">
          <p className="text-[#d3c5ac] text-xs font-bold uppercase tracking-widest mb-1">Tài Sản Đang Nắm</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f0b90b] text-sm" data-icon="account_balance">account_balance</span>
            <span className="text-xl font-bold text-[#e1e2e7]">{portfolio.length} coin</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSummary;
