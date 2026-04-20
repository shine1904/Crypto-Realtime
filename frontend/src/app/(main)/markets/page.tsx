import React from 'react';
import MarketList, { MarketCoin } from '@/components/dashboard/MarketList';

export const metadata = {
  title: 'Market Overview | CryptoRealtime',
  description:
    'Live cryptocurrency prices for 100+ assets, updated in real-time via WebSocket.',
};

/** Server-side fetch: runs at build/request time, not in the browser.
 *  Using revalidate: 10 → ISR, page is re-generated every 10 seconds on the server.
 *  This means users see data instantly on first load (no client-side loading spinner),
 *  and Pusher WebSocket takes over for real-time updates after hydration.
 */
async function getInitialMarkets(): Promise<MarketCoin[]> {
  try {
    // Use the internal backend URL directly from server (avoids CORS, faster)
    const res = await fetch('http://127.0.0.1:8000/api/markets', {
      next: { revalidate: 10 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('[MarketsPage SSR] Failed to fetch initial market data:', e);
    return [];
  }
}

export default async function MarketsPage() {
  // Fetched on the server → zero client waterfall for initial render
  const initialData = await getInitialMarkets();

  return (
    <>
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">

        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-on-surface mb-2">
                Market Dynamics
              </h1>
              <p className="text-on-surface-variant font-medium max-w-2xl text-sm sm:text-base">
                Institutional-grade market intelligence. Real-time price tracking across 100+
                global crypto assets — powered by Binance WebSocket.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <div className="bg-surface-container-lowest p-1 rounded-xl flex border border-outline-variant/10">
                <button className="bg-primary text-on-primary-fixed px-4 py-1.5 rounded-lg text-sm font-bold">
                  Spot
                </button>
                <button className="text-secondary px-4 py-1.5 rounded-lg text-sm font-bold hover:text-primary transition-colors">
                  Futures
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Stats Bar ───────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Global Market Cap', value: '$2.41T', icon: 'account_balance', trend: '+2.4%', up: true },
            { label: 'BTC Dominance', value: '53.7%', icon: 'currency_bitcoin', trend: '+0.3%', up: true },
            { label: '24h Volume', value: '$98.4B', icon: 'bar_chart', trend: '-5.1%', up: false },
            { label: 'Fear & Greed', value: '64 – Greed', icon: 'psychology', trend: null, up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-outline-variant/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-secondary text-lg">{stat.icon}</span>
                {stat.trend && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      stat.up ? 'text-[#59f8a9] bg-emerald-500/10' : 'text-[#ffb4ab] bg-red-500/10'
                    }`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-lg font-black text-on-surface">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* ── Main Market Table: SSR data + client real-time updates ── */}
        <section className="mb-12">
          {/* initialData pre-populated from server → no loading flash on first render */}
          <MarketList initialData={initialData} />
        </section>

      </main>
    </>
  );
}
