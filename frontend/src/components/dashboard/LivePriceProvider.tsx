'use client';

import React, { useState, useEffect } from 'react';
import { useSubscription, useQuery } from '@apollo/client/react';
import { PRICE_UPDATED, GET_MARKET_DATA } from '@/graphql/queries';
import { LivePrices } from './HoldingsTable';

interface LivePriceProviderProps {
  symbols: string[];
  children: (livePrices: LivePrices) => React.ReactNode;
}

const LivePriceProvider: React.FC<LivePriceProviderProps> = ({ symbols, children }) => {
  const [livePrices, setLivePrices] = useState<LivePrices>({});

  // 1. Initial Fetch: Lấy giá hiện tại từ Redis ngay khi load (SNAPSHOT)
  const { data: initialData } = useQuery<any>(GET_MARKET_DATA, {
    variables: { symbols },
    skip: symbols.length === 0,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (initialData?.marketPrices) {
      const snapshot: LivePrices = {};
      initialData.marketPrices.forEach((coin: any) => {
        snapshot[coin.symbol] = { price: coin.price, change_24h: coin.change_24h };
      });
      setLivePrices(prev => ({ ...prev, ...snapshot }));
    }
  }, [initialData]);

  // 2. Real-time Subscription: Lắng nghe cập nhật (DELTA)
  const { data: subData } = useSubscription<any>(PRICE_UPDATED, {
    variables: { symbols: symbols.length > 0 ? symbols : undefined },
    skip: symbols.length === 0,
  });

  useEffect(() => {
    if (subData?.priceUpdated) {
      const { symbol, price, change_24h } = subData.priceUpdated;
      setLivePrices(prev => ({
        ...prev,
        [symbol]: { price, change_24h },
      }));
    }
  }, [subData]);

  return <>{children(livePrices)}</>;
};

export default LivePriceProvider;
