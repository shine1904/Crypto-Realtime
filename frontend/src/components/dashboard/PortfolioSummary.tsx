import React from 'react';

const PortfolioSummary: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Net Worth Display */}
      <div className="md:col-span-2 p-6 rounded-xl bg-[#191c1f] border border-[#4f4633]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] opacity-5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <p className="text-[#d3c5ac] text-sm font-medium tracking-wide uppercase mb-2">Net Worth Portfolio</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#e1e2e7] mb-2">45,230.50 <span className="text-[#f0b90b] text-2xl">USDT</span></h1>
        <p className="text-[#c1c7d1] text-lg font-medium">≈ 0.65421890 BTC</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {/* All-time Profit */}
        <div className="p-5 rounded-xl bg-[#191c1f] border border-[#4f4633]/10">
          <p className="text-[#d3c5ac] text-xs font-bold uppercase tracking-widest mb-1">Total PnL</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-[#3be194]">+$1,200.50</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded bg-[#59f8a9]/10 text-[#59f8a9]">+12.4%</span>
          </div>
        </div>
        {/* Total Invested */}
        <div className="p-5 rounded-xl bg-[#191c1f] border border-[#4f4633]/10">
          <p className="text-[#d3c5ac] text-xs font-bold uppercase tracking-widest mb-1">Total Deposited</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f0b90b] text-sm" data-icon="account_balance">account_balance</span>
            <span className="text-xl font-bold text-[#e1e2e7]">$44,030.00</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSummary;
