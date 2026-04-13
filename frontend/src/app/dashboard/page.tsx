"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import DashboardFooter from '@/components/layout/DashboardFooter';
import { fetchPortfolio, removeAsset, WalletAsset } from '@/lib/portfolioService';

// Dynamic imports (ssr: false) để tránh lỗi Apollo hydration
const PortfolioSummary = dynamic(() => import('../../components/dashboard/PortfolioSummary'), { ssr: false });
const HoldingsTable = dynamic(() => import('../../components/dashboard/HoldingsTable'), { ssr: false });
const AllocationChart = dynamic(() => import('../../components/dashboard/AllocationChart'), { ssr: false });
const TransactionModal = dynamic(() => import('../../components/dashboard/TransactionModal'), { ssr: false });
const LivePriceProvider = dynamic(() => import('../../components/dashboard/LivePriceProvider'), { ssr: false });

export default function UserDashboard() {
  const [portfolio, setPortfolio] = useState<WalletAsset[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  // Lấy danh mục từ API
  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true);
    try {
      const data = await fetchPortfolio();
      setPortfolio(data);
    } catch (e) {
      console.error('Portfolio fetch error:', e);
    } finally {
      setLoadingPortfolio(false);
    }
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  // Xóa coin
  const handleRemove = useCallback(async (symbol: string) => {
    try {
      await removeAsset(symbol);
      setPortfolio(prev => prev.filter(w => w.coin_symbol !== symbol));
    } catch (e) {
      console.error('Remove error:', e);
    }
  }, []);

  // Lấy danh sách symbols cần subscribe (deduplicated)
  const symbols = useMemo(() => portfolio.map(w => w.coin_symbol), [portfolio]);

  return (
    <div className="bg-[#0b0e11] text-[#e1e2e7] min-h-screen pb-24 font-['Inter']">
      <Navbar />
      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-6">
        {/* LivePriceProvider gom toàn bộ subscription logic và truyền livePrices xuống con */}
        <LivePriceProvider symbols={symbols}>
          {(livePrices) => (
            <>
              <PortfolioSummary portfolio={portfolio} livePrices={livePrices} />
              <HoldingsTable
                portfolio={portfolio}
                livePrices={livePrices}
                onRemove={handleRemove}
                loading={loadingPortfolio}
              />
              <AllocationChart portfolio={portfolio} livePrices={livePrices} />
            </>
          )}
        </LivePriceProvider>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] rounded-xl shadow-[0_8px_32px_rgba(240,185,11,0.3)] flex items-center justify-center z-40 active:scale-95 transition-transform"
        onClick={() => setModalOpen(true)}
      >
        <span className="material-symbols-outlined text-[#3f2e00] font-bold text-2xl" data-icon="add">add</span>
      </button>

      <DashboardFooter />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadPortfolio}
      />
    </div>
  );
}
