'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SummaryCards = dynamic(() => import('@/components/dashboard/SummaryCards'), { ssr: false });
const MarketTable = dynamic(() => import('@/components/dashboard/MarketTable'), { ssr: false });
const MarketGrid = dynamic(() => import('@/components/dashboard/MarketGrid'), { ssr: false });

const DashboardClientWrapper: React.FC = () => {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SummaryCards />
        <MarketTable />
      </section>

      {/* Market Grid - Dynamic */}
      <MarketGrid />
    </>
  );
};

export default DashboardClientWrapper;
