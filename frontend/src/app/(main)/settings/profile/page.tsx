'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ProfileSettingsPage: React.FC = () => {
  const router = useRouter();
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [formData, setFormData] = useState({
    fullName: 'Alex Thompson',
    email: 'alex.t@nexusfoundry.io',
    phone: '+1 (555) 000-9821',
    country: 'United States',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen bg-[#111417] text-[#e1e2e7]">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-[#e1e2e7] mb-2">
          Profile Settings
        </h1>
        <p className="text-[#d3c5ac] font-medium">
          Manage your vault identity and security protocols.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Profile Picture */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#191c1f] p-8 rounded-xl relative overflow-hidden">
            {/* Glow Texture */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ffd87f]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#4f4633]/30">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZRecWtDrknVA9ZpKvUnk3k5KzgSYyoFDWiYyDgqECznZX74NhDsJUmqPOg7IQV-x05L8woCwtFmZIBJf8_HkUQSc1_mEgGVF5b7w4m_C1XW6s57Ra55mFZan2FR5A_EYOSX1AoMbCEiUpENCA4JZAUfHxeU0dn_pUw_QNeD9HSK6gZT2JLidYk4AUz_7vTRWWZNGnXlAbgig7DYJomdF_6X3c3pXXbcPj1sDm-JmKxbRctVhTPCHQ0AzKzQ8BXqs8q8Z7jKl3d4Xs"
                    alt="Profile avatar"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-[#f0b90b] text-[#251a00] p-2 rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <h2 className="text-xl font-bold text-[#e1e2e7]">{formData.fullName}</h2>
              <p className="text-sm text-[#c1c7d1] mt-1">Foundry Member since 2022</p>
              <div className="mt-8 w-full space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#0b0e11] rounded-lg border border-[#4f4633]/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d3c5ac]">
                    Account Status
                  </span>
                  <span className="text-xs font-bold text-[#59f8a9] flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Quick Glance */}
          <div className="bg-[#323538]/80 backdrop-blur-xl p-6 rounded-xl border border-[#4f4633]/15">
            <h3 className="text-sm font-bold text-[#d3c5ac] mb-4 uppercase tracking-widest">
              Security Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#c1c7d1]">2FA Status</span>
                <button
                  onClick={() => setTwoFAEnabled((v) => !v)}
                  className={`w-10 h-5 rounded-full relative flex items-center px-1 transition-colors duration-300 ${
                    twoFAEnabled ? 'bg-[#59f8a9]/20 justify-end' : 'bg-[#272a2e] justify-start'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full shadow transition-all duration-300 ${
                      twoFAEnabled
                        ? 'bg-[#59f8a9] shadow-[0_0_8px_rgba(89,248,169,0.5)]'
                        : 'bg-[#848E9C]'
                    }`}
                  />
                </button>
              </div>
              <div className="h-1 bg-[#191c1f] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#59f8a9] to-[#f0b90b] w-4/5 transition-all duration-500" />
              </div>
              <p className="text-[10px] text-[#d3c5ac]">
                Your account security is exceptional. Keep it up.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Information */}
          <section className="bg-[#0b0e11] p-8 rounded-xl border border-[#4f4633]/10">
            <h3 className="text-lg font-bold text-[#ffd87f] mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#d3c5ac] uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  className="bg-[#191c1f] border-none rounded-lg p-4 text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 placeholder:text-[#9b8f79]/50 transition"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-bold text-[#d3c5ac] uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#191c1f] border-none rounded-lg p-4 pr-24 text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 transition"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-[#59f8a9]/10 text-[#59f8a9] px-2 py-1 rounded border border-[#59f8a9]/20">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#d3c5ac] uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  className="bg-[#191c1f] border-none rounded-lg p-4 text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 transition"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#d3c5ac] uppercase tracking-widest">
                  Country / Region
                </label>
                <select
                  className="bg-[#191c1f] border-none rounded-lg p-4 text-[#e1e2e7] focus:outline-none focus:ring-1 focus:ring-[#f0b90b]/40 appearance-none transition"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Singapore</option>
                  <option>Switzerland</option>
                  <option>Vietnam</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security Protocols */}
          <section className="bg-[#0b0e11] p-8 rounded-xl border border-[#4f4633]/10">
            <h3 className="text-lg font-bold text-[#ffd87f] mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined">security</span>
              Vault Security
            </h3>

            <div className="flex items-center justify-between p-4 bg-[#191c1f] rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#e1e2e7]">Two-Factor Authentication</span>
                <span className="text-sm text-[#d3c5ac]">
                  Secure your trades with an additional verification layer.
                </span>
              </div>
              <button
                onClick={() => setTwoFAEnabled((v) => !v)}
                className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-300 ${
                  twoFAEnabled
                    ? 'bg-[#f0b90b] justify-end shadow-[0_0_12px_rgba(240,185,11,0.2)]'
                    : 'bg-[#272a2e] justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${twoFAEnabled ? 'bg-[#3f2e00]' : 'bg-[#848E9C]'}`} />
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-[#4f4633]/10 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#e1e2e7]">Login History</span>
                <span className="text-sm text-[#d3c5ac]">
                  Last session: 10m ago from San Francisco, US.
                </span>
              </div>
              <button className="text-[#c1c7d1] hover:text-[#f0b90b] transition-colors text-sm font-bold flex items-center gap-1">
                VIEW LOGS
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              className="px-8 py-4 text-[#c1c7d1] font-bold hover:bg-[#272a2e] rounded-xl transition-all active:scale-95"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              className="px-10 py-4 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] text-[#3f2e00] font-bold rounded-xl shadow-[0_4px_24px_rgba(240,185,11,0.15)] hover:shadow-[0_4px_32px_rgba(240,185,11,0.25)] transition-all active:scale-95 relative overflow-hidden"
              onClick={handleSave}
            >
              {saved ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Saved!
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettingsPage;
