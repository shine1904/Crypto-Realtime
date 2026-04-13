'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletAsset } from '@/lib/portfolioService';
import { LivePrices } from './HoldingsTable';

const CHART_COLORS = [
  '#f0b90b', '#627eea', '#9945ff', '#f7931a',
  '#00aae4', '#59f8a9', '#ffb4ab', '#c2a633',
];

interface AllocationChartProps {
  portfolio: WalletAsset[];
  livePrices: LivePrices;
}

const AllocationChart: React.FC<AllocationChartProps> = ({ portfolio, livePrices }) => {
  // Tính value từng coin bằng useMemo
  const allocations = useMemo(() => {
    const items = portfolio.map((w, i) => {
      const livePrice = livePrices[w.coin_symbol]?.price ?? w.avg_buy_price;
      return {
        symbol: w.coin_symbol,
        value: livePrice * w.amount,
        color: CHART_COLORS[i % CHART_COLORS.length],
      };
    });
    const total = items.reduce((s, a) => s + a.value, 0);
    return items.map(a => ({ ...a, pct: total > 0 ? (a.value / total) * 100 : 0 }));
  }, [portfolio, livePrices]);

  const totalValue = useMemo(
    () => allocations.reduce((s, a) => s + a.value, 0),
    [allocations]
  );

  // SVG donut chart
  const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54
  let accumulatedOffset = 0;

  const segments = allocations.map((a, i) => {
    const dashLength = (a.pct / 100) * CIRCUMFERENCE;
    const dashOffset = CIRCUMFERENCE - accumulatedOffset;
    accumulatedOffset += dashLength;
    return { ...a, dashLength, dashOffset };
  });

  // P/L tổng
  const totalPL = useMemo(() => {
    return portfolio.reduce((sum, w) => {
      const livePrice = livePrices[w.coin_symbol]?.price ?? w.avg_buy_price;
      return sum + (livePrice - w.avg_buy_price) * w.amount;
    }, 0);
  }, [portfolio, livePrices]);

  const totalInvested = useMemo(() =>
    portfolio.reduce((s, w) => s + w.avg_buy_price * w.amount, 0),
    [portfolio]
  );

  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
  const isProfit = totalPL >= 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
      {/* Allocation Donut */}
      <div className="bg-[#191c1f] p-6 rounded-xl border border-[#4f4633]/10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#d3c5ac] mb-6">Allocation</h3>
        {portfolio.length === 0 ? (
          <p className="text-[#d3c5ac] text-sm text-center py-8">Chưa có tài sản nào.</p>
        ) : (
          <div className="flex items-center gap-8">
            {/* Donut SVG */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" fill="transparent" r="54" stroke="#323538" strokeWidth="12" />
                {segments.map((seg, i) => (
                  <circle
                    key={seg.symbol}
                    cx="64" cy="64" fill="transparent" r="54"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${seg.dashLength} ${CIRCUMFERENCE - seg.dashLength}`}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="absolute text-center">
                <p className="text-[9px] font-bold text-[#d3c5ac]">TOTAL</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={totalValue}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-black text-[#e1e2e7] leading-tight"
                  >
                    ${(totalValue / 1000).toFixed(1)}K
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {allocations.map(a => (
                <div key={a.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span className="text-xs font-medium text-[#c1c7d1]">{a.symbol}</span>
                  </div>
                  <span className="text-xs font-bold text-[#e1e2e7]">{a.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio P/L Summary */}
      <div className="bg-[#191c1f] p-6 rounded-xl border border-[#4f4633]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full -mr-16 -mt-16"
          style={{ background: isProfit ? '#59f8a9' : '#ffb4ab' }} />
        <div className="relative z-10">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#d3c5ac] mb-6">Portfolio P&L</h3>
          
          <p className="text-xs text-[#d3c5ac] mb-1">Tổng Giá Trị</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={totalValue}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-[#e1e2e7] mb-3 tracking-tight"
            >
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
          </AnimatePresence>

          <p className="text-xs text-[#d3c5ac] mb-1">Tổng P/L</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={totalPL}
              initial={{ color: isProfit ? '#59f8a9' : '#ffb4ab', scale: 1.05 }}
              animate={{ color: isProfit ? '#59f8a9' : '#ffb4ab', scale: 1 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-2xl font-bold" style={{ color: isProfit ? '#59f8a9' : '#ffb4ab' }}>
                {isProfit ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded"
                style={{
                  background: isProfit ? 'rgba(89,248,169,0.1)' : 'rgba(255,180,171,0.1)',
                  color: isProfit ? '#59f8a9' : '#ffb4ab',
                }}
              >
                {isProfit ? '+' : ''}{totalPLPercent.toFixed(2)}%
              </span>
            </motion.div>
          </AnimatePresence>

          <p className="text-xs text-[#d3c5ac] mt-4">Tổng Đã Đầu Tư</p>
          <p className="text-lg font-bold text-[#e1e2e7]">
            ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AllocationChart;
