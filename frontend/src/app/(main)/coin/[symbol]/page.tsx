import React from 'react';

export default function CoinDetailPage() {
  return (
    <>
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
{/* Header Info Bar */}
<section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
<div className="flex items-center gap-6">
<div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center p-3">
<img alt="Bitcoin Logo" className="w-full h-full object-contain" data-alt="high resolution gold bitcoin logo icon with detailed texture and professional studio lighting on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF_rjqkjtNPuRBUBh_vwYgQ9nyA5ReEUlERGONYfGEP_d_1_5MlBLpk76S7YDl2SobgJgpBNimA6PB5bgxahXAJ56lx81mvsJzWcOdVQuw-Y4kDgDPoFoi7GKUi1rxSOIg3NDBKTh9mBXgnCPA3Act1LjlrN1YQuGHBOYf0Q98XmKDvn5gNIMzoXiBtNbWxkPZmJCinIGb1DRgZsqBJjrHaInCvkUykyzvo294Z3I_vfU9iXy1jfGXBrr1D1YuFOzzS5fT6f7dwVim"/>
</div>
<div>
<div className="flex items-center gap-3 mb-1">
<h1 className="text-4xl font-black tracking-tight text-on-surface">BTC / USDT</h1>
<span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">Live</span>
</div>
<p className="text-on-surface-variant font-medium">Bitcoin Foundry Protocol</p>
</div>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
<div className="flex flex-col">
<span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Price</span>
<span className="text-2xl font-bold text-tertiary">$64,289.42</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">24h Change</span>
<span className="text-2xl font-bold text-tertiary">+4.28%</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">24h High</span>
<span className="text-2xl font-bold text-on-surface">$65,120.00</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">24h Low</span>
<span className="text-2xl font-bold text-on-surface">$61,840.12</span>
</div>
</div>
</section>
{/* Main Trading Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/* Trading Chart Area (Main) */}
<div className="lg:col-span-9 space-y-6">
{/* High-End Candlestick Chart */}
<div className="bg-surface-container-lowest rounded-xl p-6 h-[600px] flex flex-col border border-outline-variant/10 relative overflow-hidden">
<div className="flex justify-between items-center mb-6">
<div className="flex gap-2">
<button className="px-3 py-1 bg-surface-container-high text-primary font-bold text-xs rounded">15m</button>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-high text-xs rounded transition-colors">1h</button>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-high text-xs rounded transition-colors">4h</button>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-high text-xs rounded transition-colors">1D</button>
<span className="w-[1px] h-4 bg-outline-variant/30 self-center mx-2"></span>
<button className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs font-medium">
<span className="material-symbols-outlined text-sm" data-icon="insights">insights</span>
                                Indicators
                            </button>
</div>
<div className="flex items-center gap-4 text-xs font-mono">
<span className="text-on-surface-variant">MA(7): <span className="text-primary">63,940.2</span></span>
<span className="text-on-surface-variant">MA(25): <span className="text-tertiary">62,110.5</span></span>
</div>
</div>
{/* Chart Simulation */}
<div className="flex-grow flex items-end gap-1.5 pb-8 relative">
{/* Horizontal Grid Lines */}
<div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
<div className="border-t border-on-surface-variant w-full"></div>
<div className="border-t border-on-surface-variant w-full"></div>
<div className="border-t border-on-surface-variant w-full"></div>
<div className="border-t border-on-surface-variant w-full"></div>
<div className="border-t border-on-surface-variant w-full"></div>
</div>
{/* Candlesticks */}
<div className="candlestick-green flex-1" style={{ height: '30%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '35%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '32%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '40%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '48%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '42%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '38%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '50%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '55%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '62%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '58%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '52%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '60%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '68%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '72%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '65%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '78%' }}></div>
<div className="candlestick-red flex-1" style={{ height: '70%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '75%' }}></div>
<div className="candlestick-green flex-1" style={{ height: '82%' }}></div>
{/* Current Price Line */}
<div className="absolute w-full border-t-2 border-dashed border-primary/40 bottom-[82%] flex justify-end">
<span className="bg-primary text-on-primary-fixed text-[10px] font-black px-2 py-0.5 rounded -mt-2.5">64,289.42</span>
</div>
</div>
{/* Volume Bars */}
<div className="h-24 flex items-end gap-1.5 opacity-40">
<div className="bg-tertiary flex-1" style={{ height: '40%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '50%' }}></div>
<div className="bg-error flex-1" style={{ height: '30%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '45%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '80%' }}></div>
<div className="bg-error flex-1" style={{ height: '60%' }}></div>
<div className="bg-error flex-1" style={{ height: '40%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '55%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '70%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '90%' }}></div>
<div className="bg-error flex-1" style={{ height: '65%' }}></div>
<div className="bg-error flex-1" style={{ height: '55%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '60%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '85%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '75%' }}></div>
<div className="bg-error flex-1" style={{ height: '50%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '95%' }}></div>
<div className="bg-error flex-1" style={{ height: '70%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '80%' }}></div>
<div className="bg-tertiary flex-1" style={{ height: '100%' }}></div>
</div>
</div>
{/* Secondary Data Panels (Asymmetric Layout) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Order Book */}
<div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
<h3 className="text-on-surface font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-lg" data-icon="list">list</span>
                            Market Liquidity
                        </h3>
<div className="space-y-1 font-mono text-xs">
<div className="flex justify-between py-1 text-error">
<span>64,302.50</span>
<span>1.2400</span>
<div className="bg-error/10 absolute right-0 h-4" style={{ width: '45%' }}></div>
</div>
<div className="flex justify-between py-1 text-error">
<span>64,298.10</span>
<span>0.8500</span>
</div>
<div className="flex justify-between py-1 text-error">
<span>64,295.00</span>
<span>2.1102</span>
</div>
<div className="flex justify-between py-4 text-xl font-bold text-on-surface border-y border-outline-variant/20 my-2">
<span>64,289.42</span>
<span className="material-symbols-outlined text-tertiary" data-icon="trending_up">trending_up</span>
</div>
<div className="flex justify-between py-1 text-tertiary">
<span>64,285.20</span>
<span>0.4500</span>
</div>
<div className="flex justify-between py-1 text-tertiary">
<span>64,282.00</span>
<span>1.5600</span>
</div>
<div className="flex justify-between py-1 text-tertiary">
<span>64,278.40</span>
<span>3.4410</span>
</div>
</div>
</div>
{/* Asset Details / Stats */}
<div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
<h3 className="text-on-surface font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-lg" data-icon="analytics">analytics</span>
                            Vault Analysis
                        </h3>
<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant text-sm">Market Cap</span>
<span className="text-on-surface font-semibold">$1.26 Trillion</span>
</div>
<div className="flex justify-between items-center">
<span className="text-on-surface-variant text-sm">Circulating Supply</span>
<span className="text-on-surface font-semibold">19.65M BTC</span>
</div>
<div className="flex justify-between items-center">
<span className="text-on-surface-variant text-sm">All-Time High</span>
<span className="text-on-surface font-semibold">$73,750.07</span>
</div>
<div className="pt-4 border-t border-outline-variant/10">
<p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                                    Bitcoin Foundry Protocol utilizes Kinetic Vault's institutional-grade security for high-frequency algorithmic trading.
                                </p>
<button className="w-full py-2 bg-surface-container-highest text-primary font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors">
                                    View Foundry Documentation
                                </button>
</div>
</div>
</div>
</div>
</div>
{/* Execution Panel (Sidebar) */}
<aside className="lg:col-span-3 space-y-6">
{/* Buy/Sell Widget */}
<div className="glass-panel rounded-xl p-6 border border-outline-variant/20 shadow-2xl">
<div className="flex p-1 bg-surface-container-lowest rounded-xl mb-6">
<button className="flex-1 py-2 text-sm font-bold bg-tertiary text-on-tertiary rounded-lg">Buy</button>
<button className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:text-error transition-colors">Sell</button>
</div>
<div className="space-y-4">
<div>
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Order Type</label>
<div className="relative">
<select className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface appearance-none focus:ring-1 focus:ring-primary/40 transition-all">
<option>Limit Order</option>
<option>Market Order</option>
<option>Stop Loss</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</div>
</div>
<div>
<div className="flex justify-between mb-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Price</label>
<span className="text-xs text-on-surface-variant">USDT</span>
</div>
<input className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface font-mono focus:ring-1 focus:ring-primary/40 transition-all" type="text" value="64,289.42"/>
</div>
<div>
<div className="flex justify-between mb-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Amount</label>
<span className="text-xs text-on-surface-variant">BTC</span>
</div>
<input className="w-full bg-surface-container-lowest border-0 rounded-xl px-4 py-3 text-on-surface font-mono focus:ring-1 focus:ring-primary/40 transition-all" placeholder="0.00" type="text"/>
</div>
<div className="grid grid-cols-4 gap-2 py-2">
<button className="bg-surface-container-highest py-1 rounded text-[10px] font-bold hover:bg-primary/20 transition-colors">25%</button>
<button className="bg-surface-container-highest py-1 rounded text-[10px] font-bold hover:bg-primary/20 transition-colors">50%</button>
<button className="bg-surface-container-highest py-1 rounded text-[10px] font-bold hover:bg-primary/20 transition-colors">75%</button>
<button className="bg-surface-container-highest py-1 rounded text-[10px] font-bold hover:bg-primary/20 transition-colors">MAX</button>
</div>
<div className="pt-4 space-y-2">
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Available Balance</span>
<span className="text-on-surface">14,204.55 USDT</span>
</div>
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Trading Fee (0.1%)</span>
<span className="text-on-surface">14.20 USDT</span>
</div>
</div>
<button className="w-full metallic-gradient py-4 rounded-xl text-on-primary-fixed font-black uppercase tracking-tighter text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">
                            Execute Buy BTC
                        </button>
</div>
</div>
{/* Recent Activity Card */}
<div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
<h3 className="text-on-surface font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-lg" data-icon="history">history</span>
                        Foundry History
                    </h3>
<div className="space-y-4">
<div className="flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
<span className="text-xs font-bold">Bought BTC</span>
</div>
<span className="text-[10px] text-on-surface-variant">2m ago</span>
</div>
<div className="flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-error"></div>
<span className="text-xs font-bold">Sold BTC</span>
</div>
<span className="text-[10px] text-on-surface-variant">14m ago</span>
</div>
<div className="flex justify-between items-center opacity-50">
<div className="flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
<span className="text-xs font-bold">Bought BTC</span>
</div>
<span className="text-[10px] text-on-surface-variant">1h ago</span>
</div>
</div>
</div>
</aside>
</div>
</main>
    </>
  );
}
