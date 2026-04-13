"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const SummaryCards = dynamic(() => import('@/components/dashboard/SummaryCards'), { ssr: false });
const MarketTable = dynamic(() => import('@/components/dashboard/MarketTable'), { ssr: false });

export default function Home() {
  return (
    <div className="text-[#e1e2e7] antialiased pb-20 min-h-screen" style={{ backgroundColor: '#0B0E11' }}>
      <main className="max-w-7xl mx-auto px-4 mt-4 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <SummaryCards />
          <MarketTable />
        </section>

        {/* Market Grid - Bento Style */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 hover:shadow-2xl hover:border-[#f0b90b]/20 transition-all">
            <p className="text-xs text-[#d3c5ac] font-medium mb-1">XRP</p>
            <p className="text-lg font-bold text-white">$0.6214</p>
            <p className="text-xs text-[#ffb4ab] font-bold">-4.56%</p>
          </div>
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 hover:shadow-2xl hover:border-[#f0b90b]/20 transition-all">
            <p className="text-xs text-[#d3c5ac] font-medium mb-1">SOL</p>
            <p className="text-lg font-bold text-white">$145.22</p>
            <p className="text-xs text-[#ffb4ab] font-bold">-2.14%</p>
          </div>
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 hover:shadow-2xl hover:border-[#f0b90b]/20 transition-all">
            <p className="text-xs text-[#d3c5ac] font-medium mb-1">DOGE</p>
            <p className="text-lg font-bold text-white">$0.1584</p>
            <p className="text-xs text-[#ffb4ab] font-bold">-5.22%</p>
          </div>
          <div className="bg-[#191c1f] p-4 rounded-xl border border-[#4f4633]/10 hover:shadow-2xl hover:border-[#f0b90b]/20 transition-all">
            <p className="text-xs text-[#d3c5ac] font-medium mb-1">PEPE</p>
            <p className="text-lg font-bold text-white">$0.0000084</p>
            <p className="text-xs text-[#ffb4ab] font-bold">-1.89%</p>
          </div>
        </section>

        {/* News Feed */}
        <section className="bg-[#0b0e11] rounded-2xl p-6 border border-[#4f4633]/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f0b90b]" data-icon="article">article</span>
              Tin tức
            </h3>
            <a className="text-sm font-semibold text-[#f0b90b] hover:underline" href="#">Xem tất cả tin tức &gt;</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="group cursor-pointer">
              <div className="aspect-video rounded-xl mb-4 overflow-hidden bg-[#1d2023]">
                <img alt="Pokemon Sunshine City" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUiQnHGwoLof9CPTeL-y97qmK_qMj2SOmhtuXA39DObiC01ocpRssw2HJ_wdSq01jQFFHYwGgQ0zVAFvIt_kFKhkPVaheyTPJw4cV4M__xO8qOLkwTpKnDnBP0WG5H0CEuZKGEIciYYicvnD8Yu3I1RiVZE3cYIFM4qCXwCXs4X27yJr9oYPQuoXq8ejmMEYVIQkZeOxitEW5DPlx428y0c8EF-8PG4e7Kb4QXtEDo7YMBoBAk7TdxrQf6ZrK6X_oyDU9fyrEOI5aN"/>
              </div>
              <h4 className="text-[#e1e2e7] font-bold leading-snug group-hover:text-[#f0b90b] transition-colors line-clamp-2">
                  Vụ Đâm Chết Người Tại Trung Tâm Pokémon Sunshine City Ở Tokyo
              </h4>
              <p className="text-[10px] text-[#d3c5ac] mt-2 uppercase tracking-widest font-black">Tin nhanh • 15 phút trước</p>
            </article>
            <article className="group cursor-pointer">
              <div className="aspect-video rounded-xl mb-4 overflow-hidden bg-[#1d2023]">
                <img alt="Saudi Finance Minister" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZlJ6Y--rSlBGLZrDyz4fUq6mAZBeewR4d8M0b4wDzfVo3-1IWvk3BFzsAXEEUwJFZg1QqgxOX-rFqbwkchimwLid6WuTGhokMok6gQBJY6gWWARz8wv_rciZuf3rWPrHBTVVt_sw5cbp0ldsjeMFLGBhEtGLZxwUN77NlBGZ-oCve7iQVpveCxpDlidOwz8eQ5xy3LSQ1MDvaZXoiIv5Rynj2ShUf-HURM4e4CNzsGVFRwgLwP_Ax7K7aq6T7S1N69m1VsGK889X5"/>
              </div>
              <h4 className="text-[#e1e2e7] font-bold leading-snug group-hover:text-[#f0b90b] transition-colors line-clamp-2">
                  Bộ trưởng Tài chính Ả Rập Xê Út: Thị Trường Dầu Đối Mặt V...
              </h4>
              <p className="text-[10px] text-[#d3c5ac] mt-2 uppercase tracking-widest font-black">Thị trường • 42 phút trước</p>
            </article>
            <article className="group cursor-pointer">
              <div className="aspect-video rounded-xl mb-4 overflow-hidden bg-[#1d2023]">
                <img alt="EU Borrell" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnITeoiHeqXCba900s9nA_7UfC4oM5kHa_HeIvGuvtL0n5Jvzy_SjU9Rq66bbpwsfWPSQYnVGSnA_lSR_E6DlECIMiI1t0f4m33oNbVLJxGsKlDoHIniLUtzoEEFjJ32f_3OY_ioSWjIFp-p6MTeiNbpic98USYDnku4561nuWbp9a7EGiF9HiSQ-n6N0nLST_JjSWe-EYXjWOAfjaBYw7Jo8ieBVcqsEEnh6pXWIqxQ31NLXb1TOSfyIJtEFvKCe35SSusRrDFO0w"/>
              </div>
              <h4 className="text-[#e1e2e7] font-bold leading-snug group-hover:text-[#f0b90b] transition-colors line-clamp-2">
                  Borrell của EU: Tác động toàn cầu của xung đột Trung Đông...
              </h4>
              <p className="text-[10px] text-[#d3c5ac] mt-2 uppercase tracking-widest font-black">Chính trị • 1 giờ trước</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
