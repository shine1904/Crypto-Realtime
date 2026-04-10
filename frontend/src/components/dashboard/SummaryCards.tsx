import React from 'react';

const SummaryCards: React.FC = () => {
  return (
    <div className="lg:col-span-8 flex flex-col justify-center">
      <h1 className="text-3xl md:text-5xl font-extrabold text-[#F0B90B] leading-tight tracking-tight mb-6">
          Nạp tiền tài khoản và nhận voucher trị giá 30 USD
      </h1>
      <div className="bg-[#1d2023] rounded-xl p-6 border border-[#4f4633]/10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0B90B]/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-[#F0B90B]/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[#d3c5ac] text-sm font-medium">Số dư ước tính của bạn</p>
            <span className="material-symbols-outlined text-[#d3c5ac] text-base" data-icon="visibility">visibility</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-white" id="btc-balance">0.00 BTC</h2>
            <span className="text-[#d3c5ac] text-xl">≈ $0.00</span>
          </div>
          <p className="text-[#d3c5ac] text-sm mb-6 flex items-center gap-1">
              PNL của hôm nay <span className="text-[#c1c7d1] font-medium">$0.00 (0.00%)</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="premium-gradient text-[#3f2e00] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
                Nạp tiền ngay
                <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
            </button>
            <button className="bg-[#272a2e] border border-[#4f4633]/30 text-[#ffd87f] font-semibold px-8 py-3 rounded-xl hover:bg-[#323538] transition-all">
                Đọc hướng dẫn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
