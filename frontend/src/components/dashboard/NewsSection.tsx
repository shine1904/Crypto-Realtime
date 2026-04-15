'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_LATEST_NEWS } from '@/graphql/queries';
import { motion } from 'framer-motion';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_name: string;
  origin_url: string;
  published_at: string;
}

interface NewsSectionProps {
  initialData?: NewsArticle[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ initialData }) => {
  const { data, loading, error } = useQuery<{ latestNews: NewsArticle[] }>(GET_LATEST_NEWS, {
    variables: { limit: 12 },
    pollInterval: 300000, // Refresh every 5 minutes
    skip: !!initialData && typeof window === 'undefined', // Skip on server if we have initialData
  });

  const news = data?.latestNews || initialData;

  if (loading && !news) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-[#191c1f] rounded-xl animate-pulse border border-[#4f4633]/10" />
      ))}
    </div>
  );

  if (error && !news) return null;
  if (!news || news.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[#e1e2e7] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f0b90b]">news</span>
          Tin Tức Crypto
        </h2>
        <span className="text-xs text-[#d3c5ac] bg-[#323538] px-2 py-1 rounded-full uppercase tracking-widest font-bold">
            Live Updates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <motion.a
            key={article.id}
            href={article.origin_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-[#191c1f] rounded-xl overflow-hidden border border-[#4f4633]/10 hover:border-[#f0b90b]/30 transition-all shadow-lg hover:shadow-[#f0b90b]/5 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative h-40 w-full overflow-hidden bg-[#0b0e11]">
              {article.thumbnail_url ? (
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#323538]">
                  <span className="material-symbols-outlined text-4xl">image</span>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#0b0e11]/80 backdrop-blur-md rounded text-[10px] font-bold text-[#f0b90b] uppercase tracking-wider border border-[#f0b90b]/20">
                {article.source_name}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[#e1e2e7] font-bold text-sm leading-snug group-hover:text-[#f0b90b] transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-[#c1c7d1] text-xs line-clamp-2 mb-4">
                  {article.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-autp">
                <span className="text-[10px] text-[#848e9c]">
                  {new Date(article.published_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="material-symbols-outlined text-[#848e9c] text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
