import React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(50, 53, 56, 0.8)' }}>
      <div className="bg-[#191c1f] w-full max-w-md rounded-xl border border-[#4f4633]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-[#4f4633]/10 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-[#e1e2e7]">Log Transaction</h2>
          <button className="text-[#c1c7d1] hover:text-[#e1e2e7]" onClick={onClose}>
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">Asset</label>
            <div className="relative">
              <select className="w-full bg-[#0b0e11] border-none rounded-lg text-sm text-[#e1e2e7] focus:ring-1 focus:ring-[#f0b90b]/40 p-3 appearance-none">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Solana (SOL)</option>
                <option>Tether (USDT)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#c1c7d1] pointer-events-none" data-icon="expand_more">expand_more</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">Amount</label>
              <input className="w-full bg-[#0b0e11] border-none rounded-lg text-sm text-[#e1e2e7] focus:ring-1 focus:ring-[#f0b90b]/40 p-3" placeholder="0.00" type="text" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">Buy Price</label>
              <input className="w-full bg-[#0b0e11] border-none rounded-lg text-sm text-[#e1e2e7] focus:ring-1 focus:ring-[#f0b90b]/40 p-3" placeholder="$0.00" type="text" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">Date</label>
            <input className="w-full bg-[#0b0e11] border-none rounded-lg text-sm text-[#e1e2e7] focus:ring-1 focus:ring-[#f0b90b]/40 p-3 color-scheme-dark" type="date" />
          </div>
          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-3 px-4 rounded-xl text-[#d3c5ac] font-bold text-sm bg-[#323538]/50 hover:bg-[#323538] transition-colors" onClick={onClose}>Cancel</button>
            <button className="flex-1 py-3 px-4 rounded-xl text-[#3f2e00] font-bold text-sm bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] shadow-lg shadow-[#f0b90b]/10 active:scale-95 transition-all">Save Asset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
