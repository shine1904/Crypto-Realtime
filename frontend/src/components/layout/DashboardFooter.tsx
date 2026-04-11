'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardFooter: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: 'monitoring', label: 'Market' },
    { href: '/dashboard', icon: 'swap_calls', label: 'Trade' },
    { href: '/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
    { href: '/settings/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#111417]/90 backdrop-blur-xl border-t border-[#4f4633]/15 flex justify-around items-center px-4 pb-4 z-50 shadow-[0_-4px_40px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-[#F0B90B] bg-gradient-to-br from-[#ffd87f]/10 to-[#f0b90b]/5'
                : 'text-[#c1c7d1] hover:text-[#F0B90B]'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              data-icon={item.icon}
            >
              {item.icon}
            </span>
            <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardFooter;
