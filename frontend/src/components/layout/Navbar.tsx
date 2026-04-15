'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TokenService } from '@/lib/tokenService';
import { logoutQuery } from '@/lib/authService';
import { useAuth } from '@/app/context/AuthContext';

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Lấy tên hiển thị từ user object của AuthContext
  const userName: string | null = (user as any)?.name ?? null;

  const handleLogout = async () => {
    try {
      const token = TokenService.getAccessToken();
      if (token) {
        await logoutQuery(token);
      }
    } catch (e) {
      console.error('Logout API failed', e);
    } finally {
      TokenService.clearData();
      setUser(null);
      setShowDropdown(false);
      router.push('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 w-full sticky top-0 z-50 bg-[#111417] border-none shadow-none">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-[#F0B90B] text-2xl" data-icon="grid_view">grid_view</span>
        <span className="text-[#F0B90B] font-black text-xl tracking-tighter">Binance</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 overflow-x-auto hide-scrollbar">
        <a className="text-[#F0B90B] font-semibold whitespace-nowrap" href="#">Mua Crypto</a>
        <Link className="text-[#848E9C] hover:text-white whitespace-nowrap" href="/markets">Thị trường</Link>
        <a className="text-[#848E9C] hover:text-white whitespace-nowrap" href="#">Giao dịch</a>
        <a className="text-[#848E9C] hover:text-white whitespace-nowrap" href="#">Futures</a>
        <a className="text-[#848E9C] hover:text-white whitespace-nowrap" href="#">Earn</a>
        <a className="text-[#848E9C] hover:text-white whitespace-nowrap" href="#">Square</a>
      </div>
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#848E9C]" data-icon="search">search</span>
        <span className="material-symbols-outlined text-[#848E9C]" data-icon="notifications">notifications</span>
        
        {userName ? (
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] text-[#251a00] font-bold flex items-center justify-center text-sm uppercase">
                {userName.charAt(0)}
              </div>
              <span className="text-[#e1e2e7] font-semibold text-sm hidden md:block">{userName}</span>
              <span className="material-symbols-outlined text-[#848E9C] text-sm">arrow_drop_down</span>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-[#191c1f] border border-[#272a2e] rounded-xl shadow-xl overflow-hidden z-[100] animate-[slideIn_0.15s_ease-out_forwards]">
                <div className="px-4 py-3 border-b border-[#272a2e]">
                  <p className="text-sm font-semibold text-[#e1e2e7] truncate">{userName}</p>
                </div>
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-[#d3c5ac] hover:bg-[#272a2e] hover:text-[#e1e2e7] transition-colors flex items-center gap-3"
                    onClick={() => {
                      setShowDropdown(false);
                      router.push('/settings/profile');
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-[#f0b90b] hover:bg-[#272a2e] hover:text-[#ffd87f] transition-colors flex items-center gap-3"
                    onClick={handleLogout}
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="bg-[#F0B90B] text-[#111417] px-4 py-1.5 rounded-lg font-bold text-sm hover:opacity-80 transition-opacity active:scale-95 duration-150">Nạp</button>
            <a className="material-symbols-outlined text-[#848E9C]" href="/login" data-icon="account_circle">account_circle</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
