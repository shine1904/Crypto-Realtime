"use client";

import React, { useState } from 'react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import PortfolioSummary from '../../components/dashboard/PortfolioSummary';
import HoldingsTable from '../../components/dashboard/HoldingsTable';
import AllocationChart from '../../components/dashboard/AllocationChart';
import TransactionModal from '../../components/dashboard/TransactionModal';

export default function UserDashboard() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-[#0b0e11] text-[#e1e2e7] min-h-screen pb-24 font-['Inter']">
      <DashboardNavbar />
      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-6">
        <PortfolioSummary />
        <HoldingsTable />
        <AllocationChart />
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] rounded-xl shadow-[0_8px_32px_rgba(240,185,11,0.3)] flex items-center justify-center z-40 active:scale-95 transition-transform"
        onClick={() => setModalOpen(true)}
      >
        <span className="material-symbols-outlined text-[#3f2e00] font-bold text-2xl" data-icon="add">add</span>
      </button>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#111417]/80 backdrop-blur-xl border-t border-[#4f4633]/15 flex justify-around items-center px-4 pb-4 z-50">
        <div className="flex flex-col items-center justify-center text-[#F0B90B] bg-gradient-to-br from-[#ffd87f]/10 to-[#f0b90b]/5 rounded-xl px-4 py-2">
          <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Market</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#c1c7d1] px-4 py-2 hover:text-[#F0B90B] transition-all duration-300">
          <span className="material-symbols-outlined" data-icon="swap_calls">swap_calls</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Trade</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#c1c7d1] px-4 py-2 hover:text-[#F0B90B] transition-all duration-300">
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
          <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Wallet</span>
        </div>
      </nav>

      {/* Transaction Modal Overlay */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
