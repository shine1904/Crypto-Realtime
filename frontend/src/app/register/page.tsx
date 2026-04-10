'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerQuery } from '@/lib/authService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerQuery({ name, email, password, password_confirmation });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111417] text-[#e1e2e7] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-transparent">
        <div className="text-[#F0B90B] text-xl font-black tracking-tighter uppercase">
          NEXUS FOUNDRY
        </div>
        <div>
          <a className="text-[#d3c5ac] hover:text-[#ffd87f] transition-colors text-sm font-medium tracking-tight" href="#">
            Help Center
          </a>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        {/* Editorial Visual Section (Asymmetric Layout) */}
        <section className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-[#0b0e11]">
          <div className="absolute inset-0 z-0 opacity-40">
            <img alt="abstract digital asset visualization" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2WslAkz3OcPNKPdkWa5727XI4gv0PjpP05In7b_r8f5LsQcnAzNOnYTPoNRdTEqAYTjPTlmtPbVUN_vVfhqnmmY4mrPD58TA9_P-hbIPmK2XABEWLcpkm7P9qKo0SBeWdRrYwfH74KZeEl0MyGzxve7BBY6RSc2DTAj2bd26jxg7tw8cAFIX49VM6O9zxGfPLR3VyBO-MIT1XS-eJkTl0_IkM3Sd1cAs_HGLcIrRg0coTSG4tYOUwU4jcy7lPRWxv8z2YSCXwf8_C"/>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-transparent to-transparent z-10"></div>
          <div className="relative z-20 flex flex-col justify-end p-16 space-y-6">
            <div className="inline-flex px-3 py-1 rounded-full bg-[#ffd87f]/10 border border-[#ffd87f]/20 text-[#ffd87f] text-xs font-bold uppercase tracking-widest w-fit">
              Institutional Access
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none text-[#e1e2e7]">
              FORGE YOUR<br/><span className="text-[#ffd87f]">FINANCIAL</span><br/>FUTURE.
            </h1>
            <p className="text-[#d3c5ac] text-lg max-w-md font-light leading-relaxed">
              Join the premier foundry for digital asset management and high-frequency trade execution. Engineered for the kinetic vault.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="h-px w-12 bg-[#4f4633]"></div>
              <span className="uppercase tracking-widest text-[#c1c7d1] text-xs">Standard Tier Registration</span>
            </div>
          </div>
        </section>
        
        {/* Registration Form Section */}
        <section className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-24 bg-[#111417]">
          <div className="w-full max-w-md space-y-10">
            <header className="space-y-2 relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#e1e2e7]">Create Account</h2>
              <p className="text-[#d3c5ac]">Enter your details to access the Nexus ecosystem.</p>
            </header>
            
            {/* Social Login Cluster */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#272a2e] hover:bg-[#323538] transition-all border border-[#4f4633]/10 group">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor"></path>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#272a2e] hover:bg-[#323538] transition-all border border-[#4f4633]/10 group">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.8 1.19-.1 2.41-.85 3.73-.72 1.55.13 2.73.71 3.5 1.84-3.11 1.87-2.58 6.01.51 7.26-.64 1.61-1.47 3.21-2.85 3.79zM12.03 7.25c-.13-2.23 1.74-4.22 3.88-4.31.25 2.39-2.05 4.53-3.88 4.31z" fill="currentColor"></path>
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
            
            <div className="relative flex items-center gap-4 z-10">
              <div className="flex-grow h-px bg-[#4f4633]/20"></div>
              <span className="text-xs uppercase tracking-widest text-[#9b8f79]">Or continue with email</span>
              <div className="flex-grow h-px bg-[#4f4633]/20"></div>
            </div>
            
            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-6 relative z-10">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}
              {/* Nổi thông báo thành công */}
              {success && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#111417] border border-[#32db8f]/60 shadow-[0_15px_50px_-10px_rgba(50,219,143,0.3)] text-[#32db8f] px-8 py-4 rounded-xl animate-[bounce_1s_infinite]">
                  <span className="material-symbols-outlined text-2xl" data-icon="task_alt">task_alt</span>
                  <span className="font-black tracking-widest uppercase text-sm">{success}</span>
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d3c5ac] px-1">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#0b0e11] border-none rounded-xl px-4 py-3.5 text-[#e1e2e7] placeholder:text-[#4f4633] focus:ring-1 focus:ring-[#ffdf99]/40 transition-all outline-none" placeholder="Foundry Member" type="text"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d3c5ac] px-1">Email Address</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#0b0e11] border-none rounded-xl px-4 py-3.5 text-[#e1e2e7] placeholder:text-[#4f4633] focus:ring-1 focus:ring-[#ffdf99]/40 transition-all outline-none" placeholder="name@nexusfoundry.com" type="email"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d3c5ac] px-1">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-[#0b0e11] border-none rounded-xl px-4 py-3.5 text-[#e1e2e7] placeholder:text-[#4f4633] focus:ring-1 focus:ring-[#ffdf99]/40 transition-all outline-none" placeholder="••••••••" type="password"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d3c5ac] px-1">Confirm</label>
                    <input value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={6} className="w-full bg-[#0b0e11] border-none rounded-xl px-4 py-3.5 text-[#e1e2e7] placeholder:text-[#4f4633] focus:ring-1 focus:ring-[#ffdf99]/40 transition-all outline-none" placeholder="••••••••" type="password"/>
                  </div>
                </div>
              </div>
              <button disabled={loading} className="bg-gradient-to-br from-[#ffd87f] to-[#f0b90b] w-full py-4 rounded-xl text-[#3f2e00] font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#f0b90b]/10 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed" type="submit">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-[#d3c5ac]">
                Already have an account? 
                <a className="text-[#ffd87f] font-bold ml-1 hover:underline underline-offset-4 decoration-2" href="/login">Log In</a>
              </p>
            </form>
            
            {/* Legal Footer */}
            <footer className="pt-8 space-y-4 relative z-10">
              <p className="text-[10px] leading-relaxed text-[#9b8f79] text-center uppercase tracking-widest">
                By clicking "Create Account", you agree to our 
                <a className="text-[#d3c5ac] hover:text-[#ffd87f] underline decoration-[#4f4633] mx-1" href="#">Terms of Service</a> 
                and 
                <a className="text-[#d3c5ac] hover:text-[#ffd87f] underline decoration-[#4f4633] mx-1" href="#">Privacy Policy</a>.
              </p>
              <div className="flex justify-center gap-6">
                <span className="material-symbols-outlined text-[#9b8f79] text-lg" title="Secure Encryption">verified_user</span>
                <span className="material-symbols-outlined text-[#9b8f79] text-lg" title="Cloud Storage">cloud_done</span>
                <span className="material-symbols-outlined text-[#9b8f79] text-lg" title="Multi-Factor Auth">admin_panel_settings</span>
              </div>
            </footer>
          </div>
        </section>
      </main>
      
      {/* Contextual Decorative Elements */}
      <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-20 hidden lg:block z-0">
        <div className="text-[160px] font-black text-[#4f4633]/10 tracking-tighter leading-none select-none">NXS</div>
      </div>
    </div>
  );
}
