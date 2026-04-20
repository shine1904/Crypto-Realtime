'use client';
import React from 'react';
import MarketList from './MarketList';

/**
 * MarketGrid – Featured coin grid on the dashboard hero section.
 * Shows top 4 coins in compact mode using the live MarketList.
 */
const MarketGrid: React.FC = () => {
  return (
    <section>
      <MarketList limit={4} compact />
    </section>
  );
};

export default MarketGrid;
