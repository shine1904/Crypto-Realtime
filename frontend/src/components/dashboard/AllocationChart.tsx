import React from 'react';

const AllocationChart: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
      {/* Allocation Bento Card */}
      <div className="bg-[#191c1f] p-6 rounded-xl border border-[#4f4633]/10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-[#d3c5ac] mb-6">Allocation</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-[#323538]" cx="64" cy="64" fill="transparent" r="54" stroke="currentColor" strokeWidth="12"></circle>
              <circle cx="64" cy="64" fill="transparent" r="54" stroke="#F0B90B" strokeDasharray="339" strokeDashoffset="170" strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute text-center">
              <p className="text-[10px] font-bold text-[#d3c5ac]">BTC</p>
              <p className="text-lg font-black text-[#e1e2e7]">50%</p>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f0b90b]"></div>
                <span className="text-xs font-medium text-[#c1c7d1]">BTC</span>
              </div>
              <span className="text-xs font-bold text-[#e1e2e7]">50%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-xs font-medium text-[#c1c7d1]">ETH</span>
              </div>
              <span className="text-xs font-bold text-[#e1e2e7]">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#59f8a9]"></div>
                <span className="text-xs font-medium text-[#c1c7d1]">USDT</span>
              </div>
              <span className="text-xs font-bold text-[#e1e2e7]">20%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Performance Card */}
      <div className="bg-[#191c1f] p-6 rounded-xl border border-[#4f4633]/10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#d3c5ac]">7D Performance</h3>
          <div className="px-2 py-1 rounded bg-[#59f8a9]/10 text-[#59f8a9] text-[10px] font-bold">+4.2%</div>
        </div>
        <div className="h-32 w-full mt-4 flex items-end gap-1">
          {/* Simple CSS bar chart visualization */}
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[60%] hover:bg-[#f0b90b]/20 transition-colors"></div>
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[45%]"></div>
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[70%]"></div>
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[55%]"></div>
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[85%]"></div>
          <div className="flex-1 bg-[#323538] rounded-t-sm h-[75%]"></div>
          <div className="flex-1 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] rounded-t-sm h-[95%] shadow-[0_0_20px_rgba(240,185,11,0.2)]"></div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-medium text-[#c1c7d1]/60">
          <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
        </div>
      </div>
    </section>
  );
};

export default AllocationChart;
