'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client/react';
import { PRICE_UPDATED } from '@/graphql/queries';
import { LivePrices } from './HoldingsTable';

interface LivePriceProviderProps {
  symbols: string[];
  children: (livePrices: LivePrices) => React.ReactNode;
}

/**
 * LivePriceProvider:
 * - Mở MỘT kênh WebSocket subscription duy nhất cho tất cả symbols
 * - Mỗi khi nhận được giá mới, cập nhật local state
 * - Truyền livePrices xuống children qua Render Props pattern
 * - Giữ nguyên giá cũ khi không nhận được update mới (không flash về 0)
 */
const LivePriceProvider: React.FC<LivePriceProviderProps> = ({ symbols, children }) => {
  const [livePrices, setLivePrices] = useState<LivePrices>({});

  const { data } = useSubscription<any>(PRICE_UPDATED, {
    variables: { symbols: symbols.length > 0 ? symbols : undefined },
    skip: symbols.length === 0,
  });

  useEffect(() => {
    if (data?.priceUpdated) {
      const { symbol, price, change_24h } = data.priceUpdated;
      setLivePrices(prev => ({
        ...prev,
        [symbol]: { price, change_24h },
      }));
    }
  }, [data]);

  return <>{children(livePrices)}</>;
};

export default LivePriceProvider;
