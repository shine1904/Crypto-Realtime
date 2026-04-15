import React from 'react';

export default function MarketsPage() {
  return (
    <>
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
{/* Header Section */}
<section className="mb-12">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Market Dynamics</h1>
<p className="text-on-surface-variant font-medium max-w-2xl">Institutional-grade market intelligence. Real-time volatility tracking and kinetic asset flows across the global vault ecosystem.</p>
</div>
<div className="flex gap-3">
<div className="bg-surface-container-lowest p-1 rounded-xl flex">
<button className="bg-primary text-on-primary-fixed px-4 py-1.5 rounded-lg text-sm font-bold">Spot</button>
<button className="text-secondary px-4 py-1.5 rounded-lg text-sm font-bold hover:text-primary transition-colors">Futures</button>
</div>
</div>
</div>
</section>
{/* Asymmetric Hero Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
{/* Top Gainers (Large Feature) */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
<div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary" data-icon="trending_up">trending_up</span>
<h2 className="text-xl font-bold tracking-tight uppercase">Top Gainers</h2>
</div>
<span className="text-xs font-bold text-tertiary tracking-widest bg-tertiary/10 px-2 py-1 rounded">24H PERFORMANCE</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="text-on-secondary-container text-[10px] uppercase tracking-[0.2em] font-black">
<th className="px-6 py-4">Asset</th>
<th className="px-6 py-4">Price</th>
<th className="px-6 py-4">Change</th>
<th className="px-6 py-4 text-right">Momentum</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary border border-outline-variant/20">N</div>
<div>
<div className="font-bold text-on-surface">Nexus</div>
<div className="text-[10px] text-secondary">NEX/USDT</div>
</div>
</div>
</td>
<td className="px-6 py-5 font-mono text-on-surface">$42,109.21</td>
<td className="px-6 py-5 font-mono text-tertiary font-bold">+18.42%</td>
<td className="px-6 py-5 text-right">
<div className="inline-flex items-end gap-0.5 h-8">
<div className="w-1 bg-tertiary/20 h-2"></div>
<div className="w-1 bg-tertiary/40 h-4"></div>
<div className="w-1 bg-tertiary/60 h-3"></div>
<div className="w-1 bg-tertiary/80 h-6"></div>
<div className="w-1 bg-tertiary h-8 shadow-[0_0_8px_rgba(89,248,169,0.5)]"></div>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary border border-outline-variant/20">F</div>
<div>
<div className="font-bold text-on-surface">Foundry</div>
<div className="text-[10px] text-secondary">FDR/USDT</div>
</div>
</div>
</td>
<td className="px-6 py-5 font-mono text-on-surface">$1.42</td>
<td className="px-6 py-5 font-mono text-tertiary font-bold">+12.05%</td>
<td className="px-6 py-5 text-right">
<div className="inline-flex items-end gap-0.5 h-8">
<div className="w-1 bg-tertiary/20 h-4"></div>
<div className="w-1 bg-tertiary/40 h-5"></div>
<div className="w-1 bg-tertiary/60 h-4"></div>
<div className="w-1 bg-tertiary/80 h-7"></div>
<div className="w-1 bg-tertiary h-6 shadow-[0_0_8px_rgba(89,248,169,0.5)]"></div>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary border border-outline-variant/20">V</div>
<div>
<div className="font-bold text-on-surface">Volt</div>
<div className="text-[10px] text-secondary">VLT/USDT</div>
</div>
</div>
</td>
<td className="px-6 py-5 font-mono text-on-surface">$0.8841</td>
<td className="px-6 py-5 font-mono text-tertiary font-bold">+9.14%</td>
<td className="px-6 py-5 text-right">
<div className="inline-flex items-end gap-0.5 h-8">
<div className="w-1 bg-tertiary/20 h-3"></div>
<div className="w-1 bg-tertiary/40 h-4"></div>
<div className="w-1 bg-tertiary/60 h-6"></div>
<div className="w-1 bg-tertiary/80 h-5"></div>
<div className="w-1 bg-tertiary h-7 shadow-[0_0_8px_rgba(89,248,169,0.5)]"></div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* High Volatility (Sidebar) */}
<div className="lg:col-span-4 flex flex-col gap-6">
<div className="bg-surface-container-high rounded-xl p-6 border border-primary/20 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="bolt">bolt</span>
</div>
<div className="relative z-10">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary" data-icon="bolt">bolt</span>
<h3 className="font-bold uppercase tracking-widest text-sm text-primary">High Volatility</h3>
</div>
<div className="space-y-4">
<div className="flex justify-between items-center">
<div>
<div className="font-bold">SOL/USDT</div>
<div className="text-[10px] text-secondary">24h Vol: $4.2B</div>
</div>
<div className="text-right">
<div className="font-mono text-error font-bold">-5.21%</div>
<div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
<div className="w-3/4 h-full bg-error animate-pulse"></div>
</div>
</div>
</div>
<div className="flex justify-between items-center">
<div>
<div className="font-bold">PEPE/USDT</div>
<div className="text-[10px] text-secondary">24h Vol: $1.8B</div>
</div>
<div className="text-right">
<div className="font-mono text-tertiary font-bold">+14.2%</div>
<div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
<div className="w-4/5 h-full bg-tertiary animate-pulse"></div>
</div>
</div>
</div>
<div className="flex justify-between items-center">
<div>
<div className="font-bold">ORDI/USDT</div>
<div className="text-[10px] text-secondary">24h Vol: $820M</div>
</div>
<div className="text-right">
<div className="font-mono text-tertiary font-bold">+8.44%</div>
<div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
<div className="w-1/2 h-full bg-tertiary animate-pulse"></div>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Market Cap Insight */}
<div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex-grow">
<h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">Market Sentiment</h3>
<div className="flex items-end justify-between mb-2">
<span className="text-3xl font-black text-on-surface">64</span>
<span className="text-sm font-bold text-tertiary uppercase">Greed</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-error via-primary-container to-tertiary"></div>
<div className="absolute right-0 top-0 bottom-0 bg-surface-container-highest w-[36%] border-l-2 border-surface-container-lowest"></div>
</div>
<p className="mt-4 text-xs text-secondary leading-relaxed">Global capitalization is up <span className="text-tertiary font-bold">2.4%</span> over the last 24 hours. Capital flows are shifting towards mid-cap foundry assets.</p>
</div>
</div>
</div>
{/* Top Losers Section */}
<section className="mb-12">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-error" data-icon="trending_down">trending_down</span>
<h2 className="text-2xl font-black tracking-tight uppercase">Top Losers</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{/* Card 1 */}
<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:border-error/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-2">
<img className="w-8 h-8 rounded-lg object-cover" data-alt="Abstract crypto token icon with glowing neon red accents on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVpv6O2aIfGQ5YV5EaJDo1jcoz7wzynh1A6m6p-cKr2KRxaHZQXTqO9uv4uXK5gNYwR1i0GunwPqpgEM8P6aXVjC9hdYa-2fXM4FV5ElWefURgoVAvzG1o1jI4ZDOjAW6hofvXTzqjQtB2BCAcyldGDIZgw1CoCAMC9G6b9pxK4FWwP0jZjnnitFxhpjPp1Zm8AgR3bsWCu86jASI3WVZ-i9pwYPmv27Zgu3_cttQzswi58IXw4OHz4EZZBdXddkNiWvEn8lhKM4MZ"/>
<span className="font-bold">LUNA</span>
</div>
<span className="font-mono text-error font-bold">-24.5%</span>
</div>
<div className="mb-4">
<div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Price</div>
<div className="font-mono text-lg text-on-surface">$0.000421</div>
</div>
<div className="h-12 w-full overflow-hidden">
<svg className="w-full h-full stroke-error fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0,5 L20,15 L40,10 L60,30 L80,25 L100,38"></path>
</svg>
</div>
</div>
{/* Card 2 */}
<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:border-error/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-2">
<img className="w-8 h-8 rounded-lg object-cover" data-alt="Close up of a stylized digital currency symbol glowing in a deep crimson light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBi48WtFEYOkfelFg_59toc9XtH9VzmTJM7YD5YKa6oq3IKz-EhEtNVHwCpm7eWw8kAoj-XGjB7l2tLAGw8p1jL3h8u5cMumpEJc28td4ie1z6wt3QgDq6e4YnoP2pXiC7lvFLybOBvNUKUyNvw00Q_AfUd3nABs0Q3M9P1wUZ39f9M-SKxDiEsfIJxeRjY_gZHLGcz5k4hJbZk5KsMSJhPmhhOMZsQGXnCyzsyXQAGqbcD3QUUPAb0h7NbrUv_1EbLiteNOV6pB2T"/>
<span className="font-bold">FTT</span>
</div>
<span className="font-mono text-error font-bold">-12.1%</span>
</div>
<div className="mb-4">
<div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Price</div>
<div className="font-mono text-lg text-on-surface">$1.22</div>
</div>
<div className="h-12 w-full overflow-hidden">
<svg className="w-full h-full stroke-error fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0,10 L30,5 L50,25 L70,20 L100,35"></path>
</svg>
</div>
</div>
{/* Card 3 */}
<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:border-error/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-2">
<img className="w-8 h-8 rounded-lg object-cover" data-alt="Futuristic digital coin icon with sharp geometric edges and dramatic red lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvQxvTTHZPOeITFR3RPlfbs6ioXaqmVlD8LYoydVfe_inZLvrawuDnS-R4_43fMWR2_5VH5FVGjcaKpwAL_wllTUkKlanOCINttLf_moPvNJiwLpvUDz0Z6ZL3DtkpcSGafLciyXc1hu9oc4P-zs0JlzI2OM9t-kP5O1wqLOkc4cE7kNXGtGmoClPY__S2H6ax8_5zW9eMv0Gc9-AxisJXG9r_nSLx4aRVMp5Q8xTKtrynJyy0qgZ5U501GJc-HB3_TLi57Oscl92k"/>
<span className="font-bold">USTC</span>
</div>
<span className="font-mono text-error font-bold">-9.82%</span>
</div>
<div className="mb-4">
<div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Price</div>
<div className="font-mono text-lg text-on-surface">$0.021</div>
</div>
<div className="h-12 w-full overflow-hidden">
<svg className="w-full h-full stroke-error fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0,5 L25,15 L50,10 L75,30 L100,35"></path>
</svg>
</div>
</div>
{/* Card 4 */}
<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:border-error/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-2">
<img className="w-8 h-8 rounded-lg object-cover" data-alt="Abstract 3D render of a crypto coin with deep red shadows and glowing reflective surfaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL6d7LWPxspFp-udMLiFj43amCOi8e2_m1Jo_2Db9h2NDBLkj9wqRNrkUslNMQchj418FN5sNkuVYsu9IuUE97Kou9VGBjLoDHz1oeeHX6VKBz5zT0PzAJuAna9J3-ahKKVQ8x-mEa7vrk34isFfmEEmCLJL9sOjnx-Oh2K9esgMpvrp6SSW6MuWi2OdPr49kus9iRn3UH5Oy7WKa9oHDRlSq_F4TRewkKqpgp1u2w4ApOWAGJiudukPBUGDvSjnOstOaNhK4ujgEG"/>
<span className="font-bold">DASH</span>
</div>
<span className="font-mono text-error font-bold">-7.45%</span>
</div>
<div className="mb-4">
<div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Price</div>
<div className="font-mono text-lg text-on-surface">$28.40</div>
</div>
<div className="h-12 w-full overflow-hidden">
<svg className="w-full h-full stroke-error fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0,15 L25,20 L50,15 L75,25 L100,30"></path>
</svg>
</div>
</div>
</div>
</section>
</main>
    </>
  );
}
