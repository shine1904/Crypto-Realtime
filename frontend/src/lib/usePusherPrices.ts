'use client';

/**
 * usePusherPrices – Shared Pusher hook for real-time crypto prices.
 *
 * Backend emits:
 *   - Channel : 'crypto-prices'
 *   - Event   : '.price.updated'   (broadcastAs = 'price.updated')
 *   - Payload : { symbol: string, price: number, change_24h: number }
 *
 * Usage:
 *   const prices = usePusherPrices();
 *   prices['BTC'] // → { price: 65000, change_24h: 2.3 }
 */

import { useState, useEffect, useCallback } from 'react';
import Pusher from 'pusher-js';

export interface CoinPrice {
  price: number;
  change_24h: number;
}

/** Map<symbol, CoinPrice> — immutable reference changes only when a coin updates */
export type PriceMap = Record<string, CoinPrice>;

/** Raw payload shape from Laravel PriceUpdated event */
interface PricePayload {
  symbol: string;
  price: number;
  change_24h: number;
}

let _pusherSingleton: Pusher | null = null;

/** Returns a singleton Pusher instance (one WS connection shared across the whole app) */
function getPusher(): Pusher {
  if (_pusherSingleton) return _pusherSingleton;

  _pusherSingleton = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? 'app-key',
    {
      wsHost:   process.env.NEXT_PUBLIC_PUSHER_HOST    ?? '127.0.0.1',
      wsPort:   Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001),
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      cluster:  process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'mt1',
    }
  );

  _pusherSingleton.connection.bind('connected', () => {
    console.log('[Pusher] ✅ Connected to Soketi');
  });

  _pusherSingleton.connection.bind('error', (err: unknown) => {
    console.error('[Pusher] ❌ Connection error:', err);
  });

  return _pusherSingleton;
}

/**
 * Hook: subscribes to 'crypto-prices' channel and accumulates price updates.
 *
 * @param initialPrices  Optional pre-seeded prices (e.g. from SSR snapshot).
 *                       Keys must be symbols, values must be CoinPrice.
 */
export function usePusherPrices(initialPrices: PriceMap = {}): PriceMap {
  const [prices, setPrices] = useState<PriceMap>(initialPrices);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pusher  = getPusher();
    const channel = pusher.subscribe('crypto-prices');

    // Event name: broadcastAs() returns 'price.updated'
    // Laravel Echo strips the dot, but raw pusher-js needs exact string
    const handler = (data: PricePayload) => {
      console.log('[WS Data]', data); // ← debug log per user request

      if (!data?.symbol) return;

      setPrices((prev) => ({
        ...prev,
        [data.symbol]: {
          price:     data.price,
          change_24h: data.change_24h,
        },
      }));
    };

    channel.bind('price.updated', handler);

    return () => {
      channel.unbind('price.updated', handler);
      // Do NOT disconnect — singleton is shared across components
    };
  }, []); // runs once — pusher singleton lives for the app lifetime

  return prices;
}

/**
 * Converts a PriceMap (from usePusherPrices) to the LivePrices shape
 * used by HoldingsTable / PortfolioSummary.
 */
export function toLivePrices(priceMap: PriceMap) {
  const out: Record<string, { price: number; change_24h: number }> = {};
  for (const [sym, v] of Object.entries(priceMap)) {
    out[sym] = v;
  }
  return out;
}
