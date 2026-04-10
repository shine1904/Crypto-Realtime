'use client';
import React, { useState } from 'react';
import { forgotPasswordQuery } from '@/lib/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await forgotPasswordQuery(email);
      setMessage(data.message || 'Reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0e11] text-[#e1e2e7] font-sans min-h-screen selection:bg-[#f0b90b]/30">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#111417] border-none">
        <div className="text-xl font-black tracking-tighter text-[#F0B90B] uppercase italic">
          NEXUS FOUNDRY
        </div>
        <a className="text-[#d3c5ac] text-sm font-medium tracking-tight hover:text-[#F0B90B] transition-colors duration-300" href="#">
          Support
        </a>
      </header>
      
      <main className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Kinetic Element (Editorial Asymmetry) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f0b90b]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-48 -left-24 w-[32rem] h-[32rem] bg-[#32db8f]/5 rounded-full blur-[150px]"></div>
        
        {/* Central Content Canvas */}
        <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-0 shadow-2xl rounded-xl overflow-hidden backdrop-blur-xl bg-[#323538]/80 border border-[#4f4633]/15">
          {/* Left Column: Editorial/Visual */}
          <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-10 bg-[#191c1f] border-r border-[#4f4633]/10">
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0b90b]/10 border border-[#f0b90b]/20">
                <span className="material-symbols-outlined text-[#f0b90b] text-sm">lock_reset</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f0b90b]">Security Protocol</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#e1e2e7] leading-[0.9] italic">
                RECOVER <br/>YOUR <br/><span className="text-[#f0b90b]">ACCESS.</span>
              </h1>
              <p className="text-[#d3c5ac] text-sm leading-relaxed max-w-xs">
                Nexus Foundry utilizes high-grade encryption to ensure your digital vault remains secure even during credential recovery.
              </p>
            </div>
            <div className="mt-auto relative z-10">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-[1px] bg-[#f0b90b] group-hover:w-16 transition-all duration-500"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#d3c5ac] font-bold">EST. 2024 NEXUS CORP</span>
              </div>
            </div>
            
            {/* Abstract Visual Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKYwy-wgY891m-44nXTTFX6iSBwg8cJHXakuRD_PaWfd5eYNT3wYHF9nrGJqSkLcyooWPatmKbVt23A9avBUhRPlvkGqtkc3vL3nu0rQUMoM59Ua5TPxcQFXHJMrZaMYl6Qv53UrSZrXnPDi9Geo9G0nP0Cvw1l7BQn0YU0uSi5_kmmKtu4f-vw3q3PZ2d8oAHKElkyrGFZkNz8SHaxYmvncEXzvh6Z-LCfJt1Jlsi-nnN2y3LkbOaMo8Z2siC_IVRvwYLe6vn9ZKN" alt="abstract 3d metallic geometric shards"/>
            </div>
          </div>
          
          {/* Right Column: Task-Focused Form */}
          <div className="col-span-1 md:col-span-7 p-8 md:p-16 lg:p-24 bg-[#111417] flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-[#e1e2e7] mb-2">Forgot Password</h2>
                <p className="text-[#d3c5ac] text-sm">Enter your email to receive a reset link.</p>
              </div>
              <form onSubmit={handleForgot} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg text-center">
                    {message}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#d3c5ac] ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#4f4633] group-focus-within:text-[#f0b90b] transition-colors">alternate_email</span>
                    </div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e11] border-none rounded-xl py-4 pl-12 pr-4 text-[#e1e2e7] placeholder:text-[#4f4633]/50 focus:ring-1 focus:ring-[#f0b90b]/40 transition-all text-sm outline-none" id="email" name="email" placeholder="name@nexusfoundry.io" required type="email"/>
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] text-[#3f2e00] font-bold py-4 rounded-xl shadow-lg shadow-[#f0b90b]/10 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" type="submit">
                  <span className="tracking-tight">{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
              </form>
              
              <div className="mt-12 pt-8 border-t border-[#4f4633]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a className="inline-flex items-center gap-2 text-sm text-[#d3c5ac] hover:text-[#f0b90b] transition-colors group" href="/login">
                  <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Log In
                </a>
                <span className="text-xs text-[#4f4633]/60 hidden sm:block">Need help? <a className="underline hover:text-[#d3c5ac]" href="#">Contact support</a></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Geometric Accents */}
        <div className="absolute top-1/4 left-10 w-2 h-24 bg-[#f0b90b]/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-2 h-48 bg-[#4f4633]/20 rounded-full hidden lg:block"></div>
      </main>
      
      {/* Footer Meta */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 opacity-30 text-[9px] uppercase tracking-[0.3em] font-bold pointer-events-none text-center w-full">
        NEXUS FOUNDRY / PORTAL ACCESS / ENCRYPTED SESSION V.2
      </footer>
    </div>
  );
}
