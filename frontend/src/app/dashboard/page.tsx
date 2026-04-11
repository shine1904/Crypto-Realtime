"use client";

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardFooter from '@/components/layout/DashboardFooter';
import PortfolioSummary from '../../components/dashboard/PortfolioSummary';
import HoldingsTable from '../../components/dashboard/HoldingsTable';
import AllocationChart from '../../components/dashboard/AllocationChart';
import TransactionModal from '../../components/dashboard/TransactionModal';

export default function UserDashboard() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-[#0b0e11] text-[#e1e2e7] min-h-screen pb-24 font-['Inter']">
      <Navbar />
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

      <DashboardFooter />

      {/* Transaction Modal Overlay */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
