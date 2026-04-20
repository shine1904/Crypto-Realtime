'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import Link from 'next/link';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import Pusher from 'pusher-js';
import { BASE_URL } from '@/lib/apiFetch';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface MarketCoin {
  symbol: string;
  price: number;
  change24h: number;
}

type FlashState = 'up' | 'down' | null;

// ─── Constants ───────────────────────────────────────────────────────────────
const ROW_HEIGHT = 64;      // px — each virtual row height
const LIST_HEIGHT = 560;    // px — visible scrollable area

// Gradient colours keyed by symbol (defined once, never re-created)
const AVATAR_GRADIENTS: Record<string, string> = {
  BTC:   'from-orange-400 to-orange-600',
  ETH:   'from-indigo-400 to-purple-600',
  BNB:   'from-yellow-400 to-yellow-600',
  SOL:   'from-purple-400 to-pink-500',
  XRP:   'from-blue-400 to-cyan-500',
  ADA:   'from-blue-500 to-blue-700',
  DOGE:  'from-yellow-300 to-amber-500',
  AVAX:  'from-red-500 to-red-700',
  PEPE:  'from-green-400 to-emerald-600',
  LINK:  'from-blue-400 to-blue-600',
  MATIC: 'from-purple-400 to-violet-600',
  DOT:   'from-pink-400 to-rose-600',
  TRX:   'from-red-400 to-red-600',
};

function formatPrice(price: number): string {
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01)   return `$${price.toFixed(6)}`;
  if (price < 1)      return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── react-window itemData context ───────────────────────────────────────────
interface RowItemData {
  items: MarketCoin[];
  flashMap: Record<string, FlashState>;
}

// ─── VirtualRow — memo with price comparison ─────────────────────────────────
// React.memo default compares props by reference.
// itemData is a new object whenever flashMap OR items change, so we provide
// a custom areEqual that only re-renders this specific row when:
//   • Its coin's price OR change24h changed
//   • Its flash state changed
const VirtualRow = memo(
  function VirtualRow({ index, style, data }: ListChildComponentProps<RowItemData>) {
    const { items, flashMap } = data;
    const coin = items[index];
    if (!coin) return null;

    const isPos     = coin.change24h >= 0;
    const flash     = flashMap[coin.symbol] ?? null;
    const gradient  = AVATAR_GRADIENTS[coin.symbol] ?? 'from-slate-500 to-slate-700';

    const rowBg =
      flash === 'up'   ? 'bg-emerald-500/10' :
      flash === 'down' ? 'bg-red-500/10'     :
      index % 2 === 0  ? ''                  : 'bg-surface-container-lowest/30';

    return (
      <div
        style={style}   // MUST use style from react-window (absolute positioning)
        className={`flex items-center border-b border-outline-variant/5
          hover:bg-surface-container-low transition-colors duration-300 ${rowBg}`}
      >
        {/* # */}
        <div className="w-12 px-4 text-xs text-secondary font-mono flex-shrink-0">
          {index + 1}
        </div>

        {/* Avatar + Symbol — clickable */}
        <Link
          href={`/coin/${coin.symbol}`}
          className="flex items-center gap-3 flex-1 min-w-0 px-2 group/coinlink"
        >
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient}
              flex items-center justify-center font-bold text-xs text-white shadow-md flex-shrink-0`}
          >
            {coin.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-on-surface text-sm leading-tight truncate group-hover/coinlink:text-primary transition-colors">{coin.symbol}</p>
            <p className="text-[10px] text-secondary truncate">{coin.symbol}/USDT</p>
          </div>
        </Link>

        {/* Price */}
        <div className="w-36 px-2 font-mono text-sm font-semibold text-on-surface flex-shrink-0">
          {formatPrice(coin.price)}
        </div>

        {/* 24h Change */}
        <div className="w-28 px-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold
            ${isPos ? 'bg-emerald-500/10 text-[#59f8a9]' : 'bg-red-500/10 text-[#ffb4ab]'}`}>
            <span className="text-[10px]">{isPos ? '▲' : '▼'}</span>
            {isPos ? '+' : ''}{coin.change24h.toFixed(2)}%
          </span>
        </div>

        {/* Sparkline (visual only) */}
        <div className="w-24 px-4 hidden md:flex items-end gap-0.5 h-6 flex-shrink-0">
          {[0.3, 0.6, 0.4, 0.8, 0.5, 0.9, isPos ? 1 : 0.2].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-sm ${isPos ? 'bg-emerald-500/60' : 'bg-red-400/60'}`}
              style={{ height: `${h * 24}px` }}
            />
          ))}
        </div>
      </div>
    );
  },
  // Custom comparator — only re-render when THIS row's data actually changed
  (prev, next) => {
    const pi = prev.data.items[prev.index];
    const ni = next.data.items[next.index];
    if (!pi || !ni) return pi === ni;         // both null → equal
    return (
      pi.price     === ni.price      &&
      pi.change24h === ni.change24h  &&
      prev.data.flashMap[pi.symbol] === next.data.flashMap[ni.symbol]
    );
  }
);

// ─── Props ────────────────────────────────────────────────────────────────────
export interface MarketListProps {
  /** Pre-fetched SSR data — avoids client loading waterfall */
  initialData?: MarketCoin[];
  /** Limit rows shown (compact widget mode) */
  limit?: number;
  /** Compact sidebar layout */
  compact?: boolean;
}

// ─── MarketList Component ────────────────────────────────────────────────────
const MarketList: React.FC<MarketListProps> = ({
  initialData = [],
  limit,
  compact = false,
}) => {
  const [coins, setCoins]       = useState<MarketCoin[]>(initialData);
  const [flashMap, setFlashMap] = useState<Record<string, FlashState>>({});
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(initialData.length === 0);
  const [error, setError]       = useState<string | null>(null);
  const [sortBy, setSortBy]     = useState<'price' | 'change'>('price');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // ── 1. Client-side REST snapshot (skip when SSR already provided data) ────
  useEffect(() => {
    if (initialData.length > 0) { setLoading(false); return; }

    const ctrl = new AbortController();
    setLoading(true);

    fetch(`${BASE_URL}/markets`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: MarketCoin[]) => setCoins(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Cannot reach backend. Is Laravel running on port 8000?');
          console.error('[MarketList] fetch error:', err);
        }
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Flash helper ───────────────────────────────────────────────────────
  const triggerFlash = useCallback((sym: string, dir: FlashState) => {
    setFlashMap((p) => ({ ...p, [sym]: dir }));
    setTimeout(() => setFlashMap((p) => ({ ...p, [sym]: null })), 900);
  }, []);

  // ── 3. Pusher real-time subscription ─────────────────────────────────────
  //
  //  BinancePriceWorker dispatches:
  //    event(new PriceUpdated($symbol, $price, $change))
  //
  //  PriceUpdated:
  //    broadcastOn()  → Channel('crypto-prices')
  //    broadcastAs()  → 'price.updated'
  //
  //  Pusher event name for non-default broadcastAs → '.price.updated'
  //  Payload shape   → { symbol: string, price: number, change_24h: number }
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

    pusher.connection.bind('connected', () => {
      console.log('[MarketList] ✅ Pusher connected');
      setWsStatus('connected');
    });
    pusher.connection.bind('error', (err: unknown) => {
      console.error('[MarketList] ❌ Pusher error:', err);
      setWsStatus('error');
    });

    // Subscribe to the CORRECT channel
    const channel = pusher.subscribe('crypto-prices');

    channel.bind('price.updated', (data: { symbol: string; price: number; change_24h: number }) => {
      // ── Debug log (requested by user) ──────────────────────────────────
      console.log('[WS Data]', data);

      if (!data?.symbol) return;

      setCoins((prev) => {
        // Find the existing entry for this symbol
        const idx = prev.findIndex((c) => c.symbol === data.symbol);
        if (idx === -1) {
          // New symbol — append it
          return [...prev, { symbol: data.symbol, price: data.price, change24h: data.change_24h }];
        }

        const old = prev[idx];

        // Determine flash direction
        const dir: FlashState =
          data.price > old.price ? 'up' :
          data.price < old.price ? 'down' : null;

        if (dir) triggerFlash(data.symbol, dir);

        // Immutable patch — only replace the changed element
        const next = [...prev];
        next[idx] = { symbol: data.symbol, price: data.price, change24h: data.change_24h };
        return next;
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('crypto-prices');
      pusher.disconnect();
    };
  }, [triggerFlash]);

  // ── 4. useMemo: filter + sort (flashMap NOT in deps — flash ≠ re-sort) ───
  const displayedCoins = useMemo<MarketCoin[]>(() => {
    const q = search.trim().toLowerCase();
    let result = q ? coins.filter((c) => c.symbol.toLowerCase().includes(q)) : coins;
    result = [...result].sort((a, b) =>
      sortBy === 'change'
        ? Math.abs(b.change24h) - Math.abs(a.change24h)
        : b.price - a.price
    );
    return limit ? result.slice(0, limit) : result;
  }, [coins, search, sortBy, limit]);

  // ── 5. Stable itemData reference for react-window ────────────────────────
  const rowData = useMemo<RowItemData>(
    () => ({ items: displayedCoins, flashMap }),
    [displayedCoins, flashMap]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // COMPACT MODE — used by MarketTable sidebar widget
  // ─────────────────────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="space-y-1">
        {loading && (
          <p className="text-center text-secondary py-4 text-xs animate-pulse">Loading market data…</p>
        )}
        {!loading && displayedCoins.map((coin) => {
          const isPos = coin.change24h >= 0;
          const flash = flashMap[coin.symbol];
          return (
            <Link
              key={coin.symbol}
              href={`/coin/${coin.symbol}`}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-surface-container
                transition-colors duration-300 cursor-pointer block
                ${flash === 'up' ? 'bg-emerald-500/10' : flash === 'down' ? 'bg-red-500/10' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary border border-outline-variant/20">
                  {coin.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{coin.symbol}</p>
                  <p className="text-[10px] text-secondary font-mono">{formatPrice(coin.price)}</p>
                </div>
              </div>
              <p className={`text-xs font-bold ${isPos ? 'text-[#59f8a9]' : 'text-[#ffb4ab]'}`}>
                {isPos ? '+' : ''}{coin.change24h.toFixed(2)}%
              </p>
            </Link>
          );
        })}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FULL TABLE MODE (virtual list)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">

      {/* Header + controls */}
      <div className="p-5 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-base">candlestick_chart</span>
          </div>
          <div>
            <h2 className="font-bold text-on-surface text-lg leading-tight">Live Market Prices</h2>
            <p className="text-xs text-secondary flex items-center gap-2">
              {loading ? 'Fetching…' : `${displayedCoins.length} assets · Real-time`}
              {!loading && (
                <span className="inline-flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse
                    ${wsStatus === 'connected' ? 'bg-emerald-400' :
                      wsStatus === 'error'     ? 'bg-red-400'     : 'bg-yellow-400'}`}
                  />
                  <span className={`font-semibold text-[10px]
                    ${wsStatus === 'connected' ? 'text-[#59f8a9]' :
                      wsStatus === 'error'     ? 'text-[#ffb4ab]' : 'text-yellow-400'}`}>
                    {wsStatus === 'connected' ? 'LIVE' :
                     wsStatus === 'error'     ? 'WS ERR' : 'CONNECTING…'}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort */}
          <div className="bg-surface-container p-1 rounded-lg flex text-xs gap-0.5">
            {(['price', 'change'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded font-bold transition-colors capitalize
                  ${sortBy === s ? 'bg-primary text-on-primary-fixed' : 'text-secondary hover:text-on-surface'}`}
              >
                By {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base pointer-events-none">
              search
            </span>
            <input
              id="market-search"
              type="text"
              placeholder="Search symbol…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container border border-outline-variant/20 text-on-surface placeholder:text-secondary
                text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-primary/50 focus:ring-1
                focus:ring-primary/30 transition-all w-44"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2 block">wifi_off</span>
          <p className="text-error font-medium text-sm">{error}</p>
          <p className="text-secondary text-xs mt-1">Check that the Laravel backend is running on port 8000.</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && !error && (
        <div className="animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 border-b border-outline-variant/5"
              style={{ height: ROW_HEIGHT }}>
              <div className="w-6 h-3 bg-surface-container-high rounded" />
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-16 h-3 bg-surface-container-high rounded" />
                <div className="w-24 h-2 bg-surface-container rounded" />
              </div>
              <div className="w-24 h-3 bg-surface-container-high rounded" />
              <div className="w-14 h-5 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Virtual table */}
      {!loading && !error && (
        <>
          {/* Static header row */}
          <div className="flex items-center border-b border-outline-variant/10 bg-surface-container-lowest
            text-[10px] uppercase tracking-[0.15em] font-black text-secondary">
            <div className="w-12 px-4 py-3">#</div>
            <div className="flex-1 px-2 py-3">Asset</div>
            <div className="w-36 px-2 py-3">Price</div>
            <div className="w-28 px-2 py-3">24h Change</div>
            <div className="w-24 px-4 py-3 hidden md:block">Momentum</div>
          </div>

          {displayedCoins.length === 0 ? (
            <div className="text-center py-16 text-secondary text-sm">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">search_off</span>
              No results for &quot;{search}&quot;
            </div>
          ) : (
            // FixedSizeList from react-window — renders ONLY visible rows
            <FixedSizeList
              height={LIST_HEIGHT}
              width="100%"
              itemCount={displayedCoins.length}
              itemSize={ROW_HEIGHT}
              itemData={rowData}   // passed to every VirtualRow as data prop
              overscanCount={5}    // pre-render 5 extra rows above/below viewport
            >
              {VirtualRow}
            </FixedSizeList>
          )}
        </>
      )}

      {/* Footer */}
      {!loading && !error && displayedCoins.length > 0 && (
        <div className="px-5 py-3 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-secondary">
            Showing <span className="text-on-surface font-semibold">{displayedCoins.length}</span> of{' '}
            <span className="text-on-surface font-semibold">{coins.length}</span> assets
          </p>
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <span className={`w-2 h-2 rounded-full animate-pulse
              ${wsStatus === 'connected' ? 'bg-emerald-400' : wsStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}
            />
            {wsStatus === 'connected' ? 'Live via crypto-prices channel' : 'Connecting to WebSocket…'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketList;
