import React from 'react';

const HoldingsTable: React.FC = () => {
  return (
    <section className="bg-[#191c1f] rounded-xl overflow-hidden border border-[#4f4633]/10">
      <div className="p-5 flex justify-between items-center border-b border-[#4f4633]/5">
        <h2 className="text-lg font-bold tracking-tight text-[#e1e2e7]">Active Holdings</h2>
        <button className="text-xs font-bold text-[#f0b90b] flex items-center gap-1 hover:opacity-80 transition-opacity">
          VIEW ALL <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0b0e11]/50">
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Asset</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Balance</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest hidden md:table-cell">Avg Price</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest">Current</th>
              <th className="px-5 py-4 text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4f4633]/5">
            <tr className="hover:bg-[#272a2e]/40 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-500 text-xl" data-icon="currency_bitcoin">currency_bitcoin</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#e1e2e7] leading-none">BTC</p>
                    <p className="text-[10px] text-[#c1c7d1] mt-1">Bitcoin</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="font-bold text-[#e1e2e7]">0.45000</p>
                <p className="text-[10px] text-[#c1c7d1] mt-1">$30,120.40</p>
              </td>
              <td className="px-5 py-4 hidden md:table-cell text-[#d3c5ac] font-medium">$62,100.00</td>
              <td className="px-5 py-4">
                <p className="font-bold text-[#3be194]">$67,820.10</p>
                <p className="text-[10px] text-[#59f8a9] mt-1">+9.2%</p>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-[#323538] text-[#f0b90b] text-[11px] font-bold border border-[#4f4633]/20 hover:bg-[#f0b90b] hover:text-[#3f2e00] transition-all">Mua thêm</button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#323538] text-[#d3c5ac] text-[11px] font-bold border border-[#4f4633]/20 hover:bg-[#ffb4ab]/10 hover:text-[#ffb4ab] transition-all">Bán bớt</button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-[#272a2e]/40 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-xl" data-icon="eth">eco</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#e1e2e7] leading-none">ETH</p>
                    <p className="text-[10px] text-[#c1c7d1] mt-1">Ethereum</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="font-bold text-[#e1e2e7]">3.24500</p>
                <p className="text-[10px] text-[#c1c7d1] mt-1">$11,450.10</p>
              </td>
              <td className="px-5 py-4 hidden md:table-cell text-[#d3c5ac] font-medium">$3,800.00</td>
              <td className="px-5 py-4">
                <p className="font-bold text-[#ffb4ab]">$3,528.00</p>
                <p className="text-[10px] text-[#ffb4ab] mt-1">-7.15%</p>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-[#323538] text-[#f0b90b] text-[11px] font-bold border border-[#4f4633]/20 hover:bg-[#f0b90b] hover:text-[#3f2e00] transition-all">Mua thêm</button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#323538] text-[#d3c5ac] text-[11px] font-bold border border-[#4f4633]/20 hover:bg-[#ffb4ab]/10 hover:text-[#ffb4ab] transition-all">Bán bớt</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HoldingsTable;
