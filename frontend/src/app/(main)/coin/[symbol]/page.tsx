'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  use,
  Suspense,
} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Pusher from 'pusher-js';
import { BASE_URL, fetchWithAuth } from '@/lib/apiFetch';
import { TokenService } from '@/lib/tokenService';
import type { OHLCVBar } from '@/components/dashboard/ProfessionalChart';

// Dynamically import chart (no SSR — DOM-dependent)
const ProfessionalChart = dynamic(
  () => import('@/components/dashboard/ProfessionalChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface CoinInfo {
  id?: number;
  symbol: string;
  name: string;
  icon_url?: string | null;
  price: number;
  change24h: number;
}

interface AlertForm {
  target_price: string;
  condition: 'above' | 'below';
}

type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(price: number): string {
  if (!price || price <= 0) return '$0.00';
  if (price < 0.0001)  return `$${price.toFixed(8)}`;
  if (price < 0.01)    return `$${price.toFixed(6)}`;
  if (price < 1)       return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatVol(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(2)}K`;
  return v.toFixed(2);
}

function formatChange(c: number): string {
  return `${c >= 0 ? '+' : ''}${c.toFixed(2)}%`;
}

// Binance stream name per interval
const INTERVAL_STREAM: Record<Interval, string> = {
  '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1d': '1d',
};

const INTERVAL_LABELS: { label: string; value: Interval }[] = [
  { label: '1m',  value: '1m'  },
  { label: '5m',  value: '5m'  },
  { label: '15m', value: '15m' },
  { label: '1h',  value: '1h'  },
  { label: '4h',  value: '4h'  },
  { label: '1D',  value: '1d'  },
];

const AVATAR_GRADIENTS: Record<string, string> = {
  BTC:  'from-orange-400 to-orange-600',
  ETH:  'from-indigo-400 to-purple-600',
  BNB:  'from-yellow-400 to-yellow-600',
  SOL:  'from-purple-400 to-pink-500',
  XRP:  'from-blue-400 to-cyan-500',
  ADA:  'from-blue-500 to-blue-700',
  DOGE: 'from-yellow-300 to-amber-500',
  AVAX: 'from-red-500 to-red-700',
};

// ─── Chart Loading Skeleton ───────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[420px] flex flex-col gap-3 p-4 animate-pulse">
      <div className="flex gap-2 mb-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-6 w-12 bg-white/5 rounded" />
        ))}
      </div>
      <div className="flex-1 bg-white/[0.03] rounded-xl" />
      <div className="h-16 bg-white/[0.02] rounded-xl" />
    </div>
  );
}

// ─── OHLCV Ticker Bar ─────────────────────────────────────────────────────────
function OHLCVBar({ bar, currentPrice }: { bar: OHLCVBar | null; currentPrice: number }) {
  const b = bar;
  const isUp = (b?.close ?? currentPrice) >= (b?.open ?? 0);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono">
      {b ? (
        <>
          <span className="text-secondary">O <span className={isUp ? 'text-emerald-400' : 'text-red-400'}>{formatPrice(b.open)}</span></span>
          <span className="text-secondary">H <span className="text-emerald-400">{formatPrice(b.high)}</span></span>
          <span className="text-secondary">L <span className="text-red-400">{formatPrice(b.low)}</span></span>
          <span className="text-secondary">C <span className={isUp ? 'text-emerald-400' : 'text-red-400'}>{formatPrice(b.close)}</span></span>
          <span className="text-secondary">Vol <span className="text-on-surface">{formatVol(b.volume)}</span></span>
        </>
      ) : (
        <span className="text-secondary">Hover over candles to see OHLCV details</span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoinDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);
  const upperSymbol = symbol.toUpperCase();

  const [coin, setCoin]             = useState<CoinInfo | null>(null);
  const [loading, setLoading]       = useState(true);
  const [wsStatus, setWsStatus]     = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [bars, setBars]             = useState<OHLCVBar[]>([]);
  const [interval, setInterval2]    = useState<Interval>('1m');
  const [hoveredBar, setHoveredBar] = useState<OHLCVBar | null>(null);

  // Price Alert state
  const [alertForm, setAlertForm]   = useState<AlertForm>({ target_price: '', condition: 'above' });
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const isLoggedIn = typeof window !== 'undefined' && !!TokenService.getAccessToken();

  const binanceWsRef = useRef<WebSocket | null>(null);
  const intervalRef  = useRef<Interval>(interval);
  intervalRef.current = interval;

  // ── 1. Fetch coin info from our backend ──────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/coins/${upperSymbol}`)
      .then(r => r.json())
      .then((data: CoinInfo) => setCoin(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [upperSymbol]);

  // ── 2. Fetch historical klines from Binance public API ───────────────────
  useEffect(() => {
    setBars([]);
    const url = `https://api.binance.com/api/v3/klines?symbol=${upperSymbol}USDT&interval=${interval}&limit=200`;
    fetch(url)
      .then(r => r.json())
      .then((raw: any[]) => {
        if (!Array.isArray(raw)) return;
        const parsed: OHLCVBar[] = raw.map(k => ({
          time:   Math.floor(k[0] / 1000),
          open:   parseFloat(k[1]),
          high:   parseFloat(k[2]),
          low:    parseFloat(k[3]),
          close:  parseFloat(k[4]),
          volume: parseFloat(k[5]),
        }));
        setBars(parsed);
      })
      .catch(err => console.error('[Kline fetch]', err));
  }, [upperSymbol, interval]);

  // ── 3. Binance WebSocket for real-time kline updates ─────────────────────
  useEffect(() => {
    // Close existing connection
    if (binanceWsRef.current) {
      binanceWsRef.current.close();
      binanceWsRef.current = null;
    }

    const stream = `wss://stream.binance.com:9443/ws/${upperSymbol.toLowerCase()}usdt@kline_${INTERVAL_STREAM[interval]}`;
    const ws = new WebSocket(stream);
    binanceWsRef.current = ws;

    ws.onopen  = () => setWsStatus('connected');
    ws.onerror = () => setWsStatus('error');
    ws.onclose = () => {};

    ws.onmessage = (evt) => {
      const msg  = JSON.parse(evt.data);
      const k    = msg.k;
      if (!k) return;

      const bar: OHLCVBar = {
        time:   Math.floor(k.t / 1000),
        open:   parseFloat(k.o),
        high:   parseFloat(k.h),
        low:    parseFloat(k.l),
        close:  parseFloat(k.c),
        volume: parseFloat(k.v),
      };

      // Also update the coin price display
      setCoin(prev => prev ? { ...prev, price: bar.close } : prev);

      setBars(prev => {
        if (prev.length === 0) return [bar];
        const last = prev[prev.length - 1];
        if (last.time === bar.time) {
          // Update the last (currently-forming) candle
          return [...prev.slice(0, -1), bar];
        }
        // New candle
        const next = [...prev, bar];
        return next.length > 500 ? next.slice(next.length - 500) : next;
      });
    };

    return () => {
      ws.close();
      binanceWsRef.current = null;
    };
  }, [upperSymbol, interval]);

  // ── 4. Pusher fallback for our own backend price display ─────────────────
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

    const ch = pusher.subscribe('crypto-prices');
    ch.bind('price.updated', (data: { symbol: string; price: number; change_24h: number }) => {
      if (data.symbol !== upperSymbol) return;
      setCoin(prev => prev ? { ...prev, price: data.price, change24h: data.change_24h } : prev);
    });

    return () => {
      ch.unbind_all();
      pusher.unsubscribe('crypto-prices');
      pusher.disconnect();
    };
  }, [upperSymbol]);

  // ── 5. Fetch user alerts ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { setAlertsLoading(false); return; }
    fetchWithAuth(`${BASE_URL}/alerts`)
      .then(r => r.json())
      .then(data => setUserAlerts(Array.isArray(data) ? data.filter((a: any) => a.symbol === upperSymbol) : []))
      .catch(console.error)
      .finally(() => setAlertsLoading(false));
  }, [upperSymbol, isLoggedIn]);

  // ── 6. Set Alert ─────────────────────────────────────────────────────────
  const handleSetAlert = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.target_price) return;
    setAlertLoading(true);
    setAlertMessage(null);
    try {
      const res = await fetchWithAuth(`${BASE_URL}/alerts`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          symbol:       upperSymbol,
          target_price: parseFloat(alertForm.target_price),
          condition:    alertForm.condition,
        }),
      });
      if (!res.ok) { const e2 = await res.json(); throw new Error(e2.message || 'Lỗi'); }
      const result = await res.json();
      setAlertMessage({ type: 'success', text: `✅ ${result.message}` });
      setAlertForm({ target_price: '', condition: 'above' });
      setUserAlerts(prev => [...prev, result.data]);
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setAlertLoading(false);
    }
  }, [alertForm, upperSymbol]);

  // ── 7. Delete Alert ──────────────────────────────────────────────────────
  const handleDeleteAlert = useCallback(async (id: number) => {
    try {
      await fetchWithAuth(`${BASE_URL}/alerts/${id}`, { method: 'DELETE' });
      setUserAlerts(prev => prev.filter(a => a.id !== id));
    } catch {}
  }, []);

  const isPos     = (coin?.change24h ?? 0) >= 0;
  const gradient  = AVATAR_GRADIENTS[upperSymbol] ?? 'from-slate-500 to-slate-700';
  const lastBar   = bars.length > 0 ? bars[bars.length - 1] : null;

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-10 bg-surface-container rounded-xl mb-8 w-1/4" />
        <div className="h-20 bg-surface-container rounded-2xl mb-6 w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-[580px] bg-surface-container rounded-2xl" />
          <div className="lg:col-span-4 h-[580px] bg-surface-container rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto">

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center gap-2 text-secondary text-sm">
        <Link href="/markets" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Markets
        </Link>
        <span>/</span>
        <span className="text-on-surface font-medium">{upperSymbol}</span>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        <div className="flex items-center gap-4">
          {coin?.icon_url ? (
            <img src={coin.icon_url} alt={upperSymbol}
              className="w-14 h-14 rounded-2xl object-contain bg-surface-container p-2" />
          ) : (
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-lg text-white shadow-lg`}>
              {upperSymbol.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-2xl font-black tracking-tight text-on-surface">
                {upperSymbol}<span className="text-secondary font-normal text-base"> / USDT</span>
              </h1>
              {/* Live badge */}
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${wsStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${wsStatus === 'connected' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                {wsStatus === 'connected' ? 'LIVE' : '…'}
              </span>
            </div>
            {coin?.name && coin.name !== upperSymbol && (
              <p className="text-secondary text-sm">{coin.name}</p>
            )}
          </div>
        </div>

        {/* Price display */}
        <div className="flex items-end gap-6">
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Live Price</p>
            <p className="text-3xl font-black tabular-nums" style={{ color: isPos ? '#0ecb81' : '#f6465d' }}>
              {formatPrice(coin?.price ?? lastBar?.close ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">24h Change</p>
            <p className={`text-2xl font-black tabular-nums ${isPos ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
              {formatChange(coin?.change24h ?? 0)}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Chart Column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="bg-[#0b0e11] rounded-2xl border border-[#1e2329] overflow-hidden">

            {/* Chart Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2329]">
              {/* Interval selector */}
              <div className="flex items-center gap-1">
                {INTERVAL_LABELS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setInterval2(value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      interval === value
                        ? 'bg-[#1e2329] text-[#f0b90b]'
                        : 'text-[#848e9c] hover:text-on-surface'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* MA Legend */}
              <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-[#f0b90b] inline-block" />
                  <span className="text-[#848e9c]">MA7</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-[#7b61ff] inline-block" />
                  <span className="text-[#848e9c]">MA25</span>
                </span>
              </div>
            </div>

            {/* OHLCV Hover Info */}
            <div className="px-5 py-2 border-b border-[#1e2329] min-h-[36px]">
              <OHLCVBar bar={hoveredBar} currentPrice={coin?.price ?? 0} />
            </div>

            {/* Chart itself */}
            <div className="h-[460px] w-full">
              {bars.length > 0 ? (
                <ProfessionalChart
                  bars={bars}
                  onCrosshairMove={setHoveredBar}
                />
              ) : (
                <ChartSkeleton />
              )}
            </div>
          </div>

          {/* Session Stats */}
          {lastBar && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[
                { label: 'Open',   value: formatPrice(lastBar.open),   color: 'text-on-surface' },
                { label: 'High',   value: formatPrice(Math.max(...bars.map(b => b.high))), color: 'text-[#0ecb81]' },
                { label: 'Low',    value: formatPrice(Math.min(...bars.map(b => b.low))),  color: 'text-[#f6465d]' },
                { label: 'Volume', value: formatVol(bars.reduce((s, b) => s + b.volume, 0)), color: 'text-on-surface' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/10 text-center">
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">{label}</p>
                  <p className={`font-bold text-sm font-mono ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-5">

          {/* ── Set Price Alert ────────────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">notifications</span>
              Đặt Cảnh Báo Giá
            </h3>

            {!isLoggedIn ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-secondary text-3xl mb-2 block">lock</span>
                <p className="text-secondary text-sm mb-3">Đăng nhập để đặt cảnh báo</p>
                <Link href="/login" className="inline-block px-5 py-2.5 bg-primary text-on-primary-fixed font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSetAlert} className="space-y-4">
                <div className="flex items-center justify-between bg-surface-container rounded-xl px-4 py-3">
                  <span className="text-secondary text-xs">Giá hiện tại</span>
                  <span className="font-mono font-bold text-primary text-sm">{formatPrice(coin?.price ?? 0)}</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Điều kiện</label>
                  <div className="flex p-1 bg-surface-container rounded-xl gap-1">
                    {(['above', 'below'] as const).map(c => (
                      <button key={c} type="button"
                        onClick={() => setAlertForm(f => ({ ...f, condition: c }))}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          alertForm.condition === c
                            ? c === 'above' ? 'bg-[#0ecb81] text-black' : 'bg-[#f6465d] text-white'
                            : 'text-secondary hover:text-on-surface'
                        }`}
                      >
                        {c === 'above' ? '▲ Tăng vượt' : '▼ Giảm xuống'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">
                    Mức giá mục tiêu (USDT)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm">$</span>
                    <input
                      type="number" step="any" min="0"
                      placeholder={coin ? String(Math.round(coin.price)) : '0'}
                      value={alertForm.target_price}
                      onChange={e => setAlertForm(f => ({ ...f, target_price: e.target.value }))}
                      required
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-xl pl-8 pr-4 py-3 text-on-surface font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>

                <button type="submit" disabled={alertLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-on-primary-fixed hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {alertLoading ? 'Đang lưu…' : '🔔 Đặt Cảnh Báo'}
                </button>

                {alertMessage && (
                  <div className={`text-xs p-3 rounded-lg ${alertMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {alertMessage.text}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* ── Active Alerts List ────────────────────────────────────── */}
          {isLoggedIn && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
              <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">rule</span>
                Cảnh Báo Của Bạn
                {userAlerts.length > 0 && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {userAlerts.length}
                  </span>
                )}
              </h3>
              {alertsLoading ? (
                <p className="text-secondary text-xs text-center py-4 animate-pulse">Đang tải…</p>
              ) : userAlerts.length === 0 ? (
                <p className="text-secondary text-xs text-center py-4">Chưa có cảnh báo nào cho {upperSymbol}</p>
              ) : (
                <div className="space-y-2">
                  {userAlerts.map(alert => (
                    <div key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        alert.is_triggered
                          ? 'border-outline-variant/10 bg-surface-container opacity-60'
                          : 'border-outline-variant/15 bg-surface-container'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alert.condition === 'above'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {alert.condition === 'above' ? '▲ ABOVE' : '▼ BELOW'}
                          </span>
                          {alert.is_triggered && (
                            <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">TRIGGERED</span>
                          )}
                        </div>
                        <p className="font-mono font-bold text-sm text-on-surface">
                          {formatPrice(parseFloat(alert.target_price))}
                        </p>
                      </div>
                      {!alert.is_triggered && (
                        <button onClick={() => handleDeleteAlert(alert.id)}
                          className="p-1.5 text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Coin Info ─────────────────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">info</span>
              Thông Tin
            </h3>
            <div className="space-y-0 text-sm divide-y divide-outline-variant/10">
              {[
                { label: 'Symbol',      value: upperSymbol,                         cls: 'font-bold' },
                { label: 'Pair',        value: `${upperSymbol}USDT`,                cls: 'font-bold' },
                { label: 'Giá hiện tại', value: formatPrice(coin?.price ?? 0),     cls: 'font-mono font-bold text-primary' },
                { label: 'Biến động 24h', value: formatChange(coin?.change24h ?? 0), cls: `font-bold ${isPos ? 'text-[#0ecb81]' : 'text-[#f6465d]'}` },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex justify-between items-center py-2.5">
                  <span className="text-secondary">{label}</span>
                  <span className={cls}>{value}</span>
                </div>
              ))}
            </div>
            <a
              href={`https://www.binance.com/en/trade/${upperSymbol}_USDT`}
              target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-secondary hover:text-on-surface text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              Xem trên Binance
            </a>
          </div>

        </aside>
      </div>
    </main>
  );
}
