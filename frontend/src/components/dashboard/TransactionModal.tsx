'use client';

import React, { useState, useCallback } from 'react';
import { addAsset } from '@/lib/portfolioService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // gọi lại để re-fetch portfolio
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setSymbol(''); setAmount(''); setAvgBuyPrice(''); setError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!symbol.trim() || !amount.trim()) {
      setError('Vui lòng nhập Symbol và Amount.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addAsset({
        symbol: symbol.trim().toUpperCase(),
        amount: parseFloat(amount),
        price: avgBuyPrice ? parseFloat(avgBuyPrice) : 0,
        type: 'BUY',
      });
      onSuccess();
      handleClose();
    } catch (e: any) {
      setError(e.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(20px)', background: 'rgba(50, 53, 56, 0.8)' }}
    >
      <div className="bg-[#191c1f] w-full max-w-md rounded-xl border border-[#4f4633]/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#4f4633]/10 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-[#e1e2e7]">Thêm Tài Sản</h2>
          <button className="text-[#c1c7d1] hover:text-[#e1e2e7]" onClick={handleClose}>
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <p className="text-[#ffb4ab] text-sm bg-[#ffb4ab]/10 p-3 rounded-lg">{error}</p>
          )}

          {/* Symbol */}
          <div>
            <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">
              Symbol (VD: BTC, ETH, SOL)
            </label>
            <input
              className="w-full bg-[#0b0e11] border border-[#4f4633]/20 rounded-lg text-sm text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 p-3 uppercase placeholder:normal-case placeholder:text-[#c1c7d1]/40"
              placeholder="Nhập mã coin..."
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">
                Số lượng
              </label>
              <input
                className="w-full bg-[#0b0e11] border border-[#4f4633]/20 rounded-lg text-sm text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 p-3"
                placeholder="0.00"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            {/* Avg Buy Price */}
            <div>
              <label className="block text-[10px] font-bold text-[#d3c5ac] uppercase tracking-widest mb-1.5">
                Giá Mua TB (USD)
              </label>
              <input
                className="w-full bg-[#0b0e11] border border-[#4f4633]/20 rounded-lg text-sm text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 p-3"
                placeholder="$0.00"
                type="number"
                min="0"
                step="any"
                value={avgBuyPrice}
                onChange={e => setAvgBuyPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 py-3 px-4 rounded-xl text-[#d3c5ac] font-bold text-sm bg-[#323538]/50 hover:bg-[#323538] transition-colors"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              className="flex-1 py-3 px-4 rounded-xl text-[#3f2e00] font-bold text-sm bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] shadow-lg shadow-[#f0b90b]/10 active:scale-95 transition-all disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu Tài Sản'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
