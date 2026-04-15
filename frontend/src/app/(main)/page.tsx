import React from 'react';
import DashboardClientWrapper from '@/components/dashboard/DashboardClientWrapper';
import NewsSection from '@/components/dashboard/NewsSection';

async function getNews() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/news', { 
      next: { revalidate: 3600 },
      cache: 'no-store' // Để demo cho nhanh, thực tế nên dùng revalidate
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('Failed to fetch news on server:', e);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();

  return (
    <div className="text-[#e1e2e7] antialiased pb-20 min-h-screen" style={{ backgroundColor: '#0B0E11' }}>
      <main className="max-w-7xl mx-auto px-4 mt-4 space-y-12">
        <DashboardClientWrapper />

        {/* Dynamic News Feed with SSR Initial Data */}
        <NewsSection initialData={news} />
      </main>
    </div>
  );
}
