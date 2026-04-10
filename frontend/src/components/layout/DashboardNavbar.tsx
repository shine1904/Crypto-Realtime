import React from 'react';

const DashboardNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#111417] border-b border-[#4f4633]/15 flex justify-between items-center h-16 px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#272a2e] border border-[#4f4633]/20 flex items-center justify-center overflow-hidden">
          <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKJUZ2o0jUGQcg7xG_mbvWXPk7KFJprPMy0i89HQpuIgb_dVhIkbOUNcOjRbYXuOWNwnUBfC19GHLQPoJq8HnHeaPiu9-NiYgDoJkfVQVqD5rxyfnZZXxv2RwOQDtHQMnD5Kb6i-4Wqi2Y2zoymPuTwivhYCMi81OEY5GnyzU3lvN_DWGJCw1H-vENNeV3POoxkNjgyoYsV0DNk-frwTH3TFTO_0l_TsmFBQSgIcUz4jotqZM08EfanBSv8OzIkHg3y1c4Qa8NoKZs"/>
        </div>
        <span className="text-xl font-black tracking-tighter text-[#F0B90B] uppercase font-['Inter']">NEXUS FOUNDRY</span>
      </div>
      <button className="text-[#F0B90B] hover:bg-[#272a2e] transition-colors duration-300 p-2 rounded-xl">
        <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
    </header>
  );
};

export default DashboardNavbar;
