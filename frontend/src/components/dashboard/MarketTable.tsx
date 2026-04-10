'use client';
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MARKET_DATA } from '@/graphql/queries';

const symbols = ['BTC', 'ETH', 'BNB'];

const MarketTable: React.FC = () => {
  const { data, loading } = useQuery<any>(GET_MARKET_DATA, {
    variables: { symbols },
    pollInterval: 1000, // Cập nhật mỗi 1 giây
  });

  const coinList = data?.marketPrices || [];

  // Hàm helper để render màu sắc giá
  const getChangeColor = (change: number) => 
    change >= 0 ? 'text-[#0ecb81]' : 'text-[#ffb4ab]';

  return (
    <div className="lg:col-span-4 flex flex-col gap-4">
      {/* New Listings Countdown (Vẫn giữ UI nhưng có thể dùng dynamic data sau) */}
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

      {/* Market Mini-List */}
      <div className="bg-[#1d2023] rounded-xl overflow-hidden border border-[#4f4633]/10">
        <div className="flex border-b border-[#4f4633]/10">
          <button className="flex-1 py-4 text-sm font-bold text-[#f0b90b] border-b-2 border-[#f0b90b]">Phổ biến</button>
          <button className="flex-1 py-4 text-sm font-bold text-[#d3c5ac]">Niêm yết mới</button>
        </div>

        <div className="p-2 space-y-1">
          {!data && loading && (
  <p className="text-center text-[#d3c5ac] py-4 text-xs animate-pulse">
    Please Wait...
  </p>
)}
          {coinList.map((coin: any) => (
            <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#272a2e] transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-inner 
                  ${coin.symbol === 'BTC' ? 'bg-[#f7931a]' : coin.symbol === 'ETH' ? 'bg-[#627eea]' : 'bg-[#f0b90b] text-black'}`}>
                  {coin.symbol[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{coin.symbol}</p>
                  <p className="text-[10px] text-[#d3c5ac]">{coin.symbol === 'BTC' ? 'Bitcoin' : coin.symbol === 'ETH' ? 'Ethereum' : 'Binance Coin'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  ${coin.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-xs font-medium ${getChangeColor(coin.change_24h)}`}>
                  {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h}%
                </p>
              </div>
            </div>
          ))}
        </div>

        <a className="block text-center py-3 text-xs font-semibold text-[#d3c5ac] hover:text-[#f0b90b] transition-colors border-t border-[#4f4633]/10" href="#">
            Xem tất cả 350+ coin &gt;
        </a>
      </div>
    </div>
  );
};

export default MarketTable;