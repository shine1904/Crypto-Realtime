'use client';

/**
 * LivePriceProvider
 *
 * Provides real-time prices from the CORRECT Pusher channel:
 *   Channel : 'crypto-prices'
 *   Event   : '.price.updated'   ← broadcastAs() = 'price.updated'
 *   Payload : { symbol, price, change_24h }
 *
 * Replaces the old GraphQL subscription (which was broken because the backend
 * actually dispatches PriceUpdated via Pusher, not GraphQL subscriptions).
 */

import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { LivePrices } from './HoldingsTable';
import { BASE_URL } from '@/lib/apiFetch';

interface LivePriceProviderProps {
  /** The symbols to track (e.g. ['BTC', 'ETH']) */
  symbols: string[];
  /** Render-prop — receives live price map */
  children: (livePrices: LivePrices) => React.ReactNode;
}

const LivePriceProvider: React.FC<LivePriceProviderProps> = ({ symbols, children }) => {
  const [livePrices, setLivePrices] = useState<LivePrices>({});
  const symbolSet = useRef<Set<string>>(new Set(symbols));

  // Update symbol set when symbols prop changes
  useEffect(() => {
    symbolSet.current = new Set(symbols);
  }, [symbols]);

  // ── 1. REST snapshot: fetch current prices for these symbols ──────────────
  useEffect(() => {
    if (symbols.length === 0) return;

    fetch(`${BASE_URL}/markets`, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Array<{ symbol: string; price: number; change24h: number }>) => {
        const snap: LivePrices = {};
        data.forEach((coin) => {
          const symbolUpper = coin.symbol.toUpperCase();
          let matchedSymbol = null;
          for (const s of symbolSet.current) {
            if (s.toUpperCase() === symbolUpper) {
              matchedSymbol = s;
              break;
            }
          }
          if (matchedSymbol) {
            snap[matchedSymbol] = { price: coin.price, change_24h: coin.change24h };
          }
        });
        if (Object.keys(snap).length > 0) {
          setLivePrices((prev) => ({ ...prev, ...snap }));
        }
      })
      .catch((err) => console.error('[LivePriceProvider] snapshot fetch error:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(',')]); // re-fetch only when symbol list actually changes

  // ── 2. Real-time Pusher subscription ─────────────────────────────────────
  //
  //  BinancePriceWorker → event(new PriceUpdated($symbol, $price, $change))
  //  PriceUpdated::broadcastOn()  → Channel('crypto-prices')
  //  PriceUpdated::broadcastAs()  → 'price.updated'
  //  Pusher event key             → 'price.updated'
  //
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? 'app-key',
      {
        wsHost:            process.env.NEXT_PUBLIC_PUSHER_HOST ?? '127.0.0.1',
        wsPort:            Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001),
        forceTLS:          false,
        disableStats:      true,
        enabledTransports: ['ws', 'wss'],
        cluster:           process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'mt1',
      }
    );

    const channel = pusher.subscribe('crypto-prices');

    channel.bind('price.updated', (data: { symbol: string; price: number; change_24h: number }) => {
      // Debug log
      console.log('[WS Data]', data);

      // Only update if this symbol is in our tracked set (case-insensitive)
      const symbolUpper = data.symbol.toUpperCase();
      let matchedSymbol = null;
      for (const s of symbolSet.current) {
         if (s.toUpperCase() === symbolUpper) {
            matchedSymbol = s;
            break;
         }
      }
      
      if (!matchedSymbol) return;

      setLivePrices((prev) => ({
        ...prev,
        [matchedSymbol]: {
          price:     data.price,
          change_24h: data.change_24h,
        },
      }));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('crypto-prices');
      pusher.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // subscribe once — symbolSet ref handles dynamic symbol changes

  return <>{children(livePrices)}</>;
};

export default LivePriceProvider;
