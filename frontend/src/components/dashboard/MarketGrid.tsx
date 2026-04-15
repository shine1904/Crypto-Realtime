'use client';
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MARKET_DATA } from '@/graphql/queries';

const FEATURED_SYMBOLS = ['XRP', 'SOL', 'DOGE', 'PEPE'];

const MarketGrid: React.FC = () => {
  const { data, loading } = useQuery<any>(GET_MARKET_DATA, {
    variables: { symbols: FEATURED_SYMBOLS },
    pollInterval: 1000,
  });

  const coinList = data?.marketPrices || [];

  if (loading && !data) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 h-24" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {coinList.map((coin: any) => (
        <div key={coin.symbol} className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 hover:shadow-2xl hover:border-[#f0b90b]/20 transition-all group">
          <p className="text-xs text-[#d3c5ac] font-medium mb-1 uppercase">{coin.symbol}</p>
          <p className="text-lg font-bold text-white">
            ${coin.price?.toLocaleString(undefined, { minimumFractionDigits: coin.price < 0.01 ? 8 : 2 })}
          </p>
          <p className={`text-xs font-bold ${coin.change_24h >= 0 ? 'text-[#0ecb81]' : 'text-[#ffb4ab]'}`}>
            {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h?.toFixed(2)}%
          </p>
        </div>
      ))}
    </section>
  );
};

export default MarketGrid;
