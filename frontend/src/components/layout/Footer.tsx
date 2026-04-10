import React from 'react';

const Footer: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-2 pb-safe bg-[#111417] border-t border-[#272a2e]/20 shadow-2xl z-50 md:hidden">
      <a className="flex flex-col items-center justify-center text-[#F0B90B] font-bold py-1" href="#">
        <span className="material-symbols-outlined mb-0.5" data-icon="insert_chart" style={{fontVariationSettings: "'FILL' 1"}}>insert_chart</span>
        <span className="text-[10px] font-medium">Thị trường</span>
      </a>
      <a className="flex flex-col items-center justify-center text-[#848E9C] hover:text-white py-1" href="#">
        <span className="material-symbols-outlined mb-0.5" data-icon="swap_horiz">swap_horiz</span>
        <span className="text-[10px] font-medium">Giao dịch</span>
      </a>
      <a className="flex flex-col items-center justify-center text-[#848E9C] hover:text-white py-1" href="#">
        <span className="material-symbols-outlined mb-0.5" data-icon="currency_exchange">currency_exchange</span>
        <span className="text-[10px] font-medium">Futures</span>
      </a>
      <a className="flex flex-col items-center justify-center text-[#848E9C] hover:text-white py-1" href="#">
        <span className="material-symbols-outlined mb-0.5" data-icon="payments">payments</span>
        <span className="text-[10px] font-medium">Earn</span>
      </a>
      <a className="flex flex-col items-center justify-center text-[#848E9C] hover:text-white py-1" href="">
        <span className="material-symbols-outlined mb-0.5" data-icon="account_balance_wallet">account_balance_wallet</span>
        <span className="text-[10px] font-medium">Ví</span>
      </a>
    </nav>
  );
};

export default Footer;
