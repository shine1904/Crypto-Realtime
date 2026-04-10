'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginQuery } from '@/lib/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await loginQuery({ email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        if (data.user?.name) {
          localStorage.setItem('user_name', data.user.name);
        }
      }
      setSuccess('Đăng nhập thành công! Đang vào sàn...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111417] text-[#e1e2e7] font-sans min-h-screen selection:bg-[#f0b90b] selection:text-[#3f2e00]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#111417] border-b border-[#272a2e]/10 shadow-none flex items-center justify-between px-6 h-16 w-full max-w-none">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#F0B90B]" data-icon="toll">toll</span>
          <span className="text-xl font-black tracking-tighter text-[#F0B90B] uppercase">NEXUS FOUNDRY</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-[#d3c5ac] font-medium hover:text-[#F0B90B] transition-colors">Login</button>
          <a href="/register" className="px-5 py-2 bg-[#f0b90b] text-[#251a00] font-bold rounded-xl active:scale-95 transition-transform inline-block">Register</a>
          <button className="material-symbols-outlined text-[#EAECEF] hover:bg-[#272a2e] p-2 rounded-lg transition-colors" data-icon="menu">menu</button>
        </div>
      </header>
      
      {/* Main Content Canvas */}
      <main className="min-h-screen pt-16 flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Abstract Kinetic Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f0b90b]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#32db8f]/5 rounded-full blur-[100px]"></div>
        
        {/* Login Container */}
        <div className="w-full max-w-md z-10">
          {/* Editorial Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#e1e2e7] mb-2">Welcome Back.</h1>
            <p className="text-[#d3c5ac] text-lg">Enter the kinetic vault to manage your assets.</p>
          </div>
          
          {/* Form Card */}
          <div className="bg-[#191c1f] rounded-xl p-8 border border-[#4f4633]/10 shadow-2xl relative overflow-hidden">
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#f0b90b]"></div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}
              {/* Nổi thông báo thành công */}
              {success && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#111417] border border-[#f0b90b]/60 shadow-[0_15px_50px_-10px_rgba(240,185,11,0.3)] text-[#f0b90b] px-8 py-4 rounded-xl animate-[bounce_1s_infinite]">
                  <span className="material-symbols-outlined text-2xl" data-icon="task_alt">task_alt</span>
                  <span className="font-black tracking-widest uppercase text-sm">{success}</span>
                </div>
              )}
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#d3c5ac] ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#0b0e11] border-none text-[#e1e2e7] rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-[#f0b90b]/40 placeholder:text-[#323538] outline-none transition-all duration-300" id="email" placeholder="name@nexusfoundry.io" type="email"/>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#323538] group-focus-within:text-[#f0b90b] transition-colors" data-icon="alternate_email">alternate_email</span>
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-semibold text-[#d3c5ac]" htmlFor="password">Password</label>
                  <a className="text-xs font-bold text-[#ffd87f] hover:text-[#f0b90b] transition-colors" href="/forgot-password">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#0b0e11] border-none text-[#e1e2e7] rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-[#f0b90b]/40 placeholder:text-[#323538] outline-none transition-all duration-300" id="password" placeholder="••••••••" type="password"/>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#323538] group-focus-within:text-[#f0b90b] cursor-pointer transition-colors" data-icon="visibility">visibility</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button disabled={loading} className="w-full bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] text-[#251a00] font-bold py-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(240,185,11,0.3)] active:scale-[0.98] transition-all duration-200 disabled:opacity-70" type="submit">
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-grow h-[1px] bg-[#4f4633]/10"></div>
              <span className="px-4 text-xs font-bold text-[#323538] uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow h-[1px] bg-[#4f4633]/10"></div>
            </div>
            
            {/* Social Logins */}
            <button 
  type="button" 
  onClick={() => { window.location.href = 'http://localhost:8000/api/auth/google'; }}
  className="flex items-center justify-center gap-2 bg-[#272a2e] hover:bg-[#323538] py-3 rounded-xl border border-[#4f4633]/5 transition-colors group"
>
  <img 
    alt="Google" 
    className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" 
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
  />
  <span className="text-sm font-bold text-[#e1e2e7]">Google</span>
</button>
          </div>
          
          {/* Footer Link */}
          <p className="mt-8 text-center text-[#d3c5ac]">
            Don't have an account? 
            <a className="text-[#ffd87f] font-bold hover:text-[#f0b90b] transition-colors ml-1" href="/register">Sign Up</a>
          </p>
        </div>
        
        {/* System Security Indicator */}
        <div className="absolute bottom-8 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#323538] uppercase">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          Military-Grade Encryption Active
        </div>
      </main>
      
      {/* Decorative Sidebar Element (Hidden on mobile) */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-[30%] bg-[#0b0e11] z-0 pointer-events-none border-l border-[#4f4633]/5">
        <div className="h-full flex flex-col justify-center px-12 opacity-20">
          <div className="mb-12">
            <div className="h-1 w-24 bg-[#ffd87f] mb-4"></div>
            <div className="text-6xl font-black text-[#e1e2e7] leading-none tracking-tighter">NXSF<br/>FOUNDRY</div>
          </div>
          <div className="space-y-4">
            <div className="h-2 w-full bg-[#272a2e] rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b]"></div>
            </div>
            <div className="h-2 w-full bg-[#272a2e] rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b]"></div>
            </div>
            <div className="h-2 w-full bg-[#272a2e] rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-br from-[#ffd87f] to-[#f0b90b]"></div>
            </div>
          </div>
          <img alt="Nexus Background" className="mt-12 w-full aspect-video object-cover rounded-xl grayscale opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqvbtl_36qXUNC2Dai257Pl6KD0YLifuXURFvZaUnx55p1-3sVsaMt40OQZoGn4u4_nb8aOIMlaS-PoxHHwAjlI-oC57c0RAc3uoANZtCqu_fc_I4xjfOoQThKuC8e73W72RGcnF2rjNFufuBERZnpxN4Shs9Qk3iqXK4ii1iBqrj8xfKrbFRsd7EO310j2qr6aLjUNRMStdHaW7V1Z2z18JoGeBWsz606R25JmxTAdbSl3_VvE444CDSsirJbYzJHDPxKQuYPioYL"/>
        </div>
      </div>
    </div>
  );
}
