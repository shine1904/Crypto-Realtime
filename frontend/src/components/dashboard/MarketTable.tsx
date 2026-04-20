'use client';
import React from 'react';
import MarketList from './MarketList';

/**
 * MarketTable – Dashboard sidebar widget.
 * Renders the top 5 coins in compact mode using MarketList
 * (REST snapshot + Pusher real-time, replaces GraphQL pollInterval).
 */
const MarketTable: React.FC = () => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-4">
      {/* Niêm yết mới – kept as decorative/static for now */}
      <div className="bg-[#0b0e11] border border-[#4f4633]/10 rounded-xl p-5 flex items-center justify-between group hover:border-[#f0b90b]/20 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#3f2e00] font-bold">token</span>
          </div>
          <div>
            <p className="text-xs text-[#d3c5ac] font-bold uppercase tracking-wider">Niêm yết mới</p>
            <p className="text-xl font-black text-white">XAUT</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#d3c5ac] mb-1 font-medium">Bắt đầu sau</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-black text-[#f0b90b]">19 P 11 S</span>
          </div>
        </div>
      </div>

      {/* Live Mini-List using MarketList compact mode */}
      <div className="bg-[#1d2023] rounded-xl overflow-hidden border border-[#4f4633]/10">
        <div className="flex border-b border-[#4f4633]/10">
          <button className="flex-1 py-4 text-sm font-bold text-[#f0b90b] border-b-2 border-[#f0b90b]">
            Phổ biến
          </button>
          <button className="flex-1 py-4 text-sm font-bold text-[#d3c5ac]">
            Niêm yết mới
          </button>
        </div>

        <div className="p-2">
          {/* Show top 5 coins in compact mode, real-time */}
          <MarketList limit={5} compact />
        </div>

        <a
          className="block text-center py-3 text-xs font-semibold text-[#d3c5ac] hover:text-[#f0b90b] transition-colors border-t border-[#4f4633]/10"
          href="/markets"
        >
          Xem tất cả 100+ coin &gt;
        </a>
      </div>
    </div>
  );
};

export default MarketTable;