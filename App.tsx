
import React, { useState, useEffect } from 'react';
import { Shield, Lock, ShieldCheck, User, LogOut, Settings, AlertCircle, Menu, X } from 'lucide-react';
import CallGuardian from './components/CallGuardian';
import IdentityPassport from './components/IdentityPassport';
import BrowserDetector from './components/BrowserDetector';
import Sidebar from './components/Sidebar';

export type ActiveTab = 'guardian' | 'passport' | 'browser' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guardian');
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [tempName, setTempName] = useState('');
  const [tempPass, setTempPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('hope_vault_id');
    if (savedId) {
      setVaultId(savedId);
      setMode('login');
    }
  }, []);

  const handleAuth = () => {
    setError('');
    if (!tempName.trim() || !tempPass.trim()) {
      setError('Điền đủ thông tin');
      return;
    }
    if (tempPass.length > 18) {
      setError('Mật khẩu tối đa 18 ký tự');
      return;
    }

    if (mode === 'signup') {
      const uniqueId = `HOPE-${tempName.toUpperCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      localStorage.setItem('hope_vault_id', uniqueId);
      localStorage.setItem('hope_user_name', tempName);
      localStorage.setItem('hope_user_pass', tempPass);
      setVaultId(uniqueId);
      setUserName(tempName);
      setIsLoggedIn(true);
    } else {
      const savedName = localStorage.getItem('hope_user_name');
      const savedPass = localStorage.getItem('hope_user_pass');
      if (tempName === savedName && tempPass === savedPass) {
        setUserName(savedName);
        setIsLoggedIn(true);
      } else {
        setError('Sai tài khoản hoặc mật khẩu');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#02040a] flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="max-w-md w-full space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-900/40">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Hope</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Lá chắn bảo mật năm 2026</p>
            </div>
          </div>

          <div className="glass p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-5">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg md:text-xl font-bold text-white">
                {mode === 'signup' ? 'Tạo tài khoản' : 'Mở khóa Vault'}
              </h2>
              <div className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-1 rounded border border-emerald-500/20 uppercase">Secure</div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tên tài khoản</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white focus:border-emerald-500 transition-all outline-none"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Tên của bạn..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mật khẩu</label>
                  <span className={`text-[9px] font-bold ${tempPass.length > 18 ? 'text-red-500' : 'text-slate-600'}`}>
                    {tempPass.length}/18
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    maxLength={18}
                    className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white focus:border-emerald-500 transition-all outline-none"
                    value={tempPass}
                    onChange={(e) => setTempPass(e.target.value)}
                    placeholder="Mật khẩu..."
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold px-3 py-2 bg-red-500/5 rounded-xl border border-red-500/10 uppercase">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </div>

            <button 
              onClick={handleAuth}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
            >
              {mode === 'signup' ? 'Kích hoạt' : 'Đăng nhập'}
            </button>

            <button 
              onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
              className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white"
            >
              {mode === 'signup' ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có? Tạo Hầm chứa'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#02040a] text-slate-200">
      {/* Sidebar for Desktop / Mobile Overlay */}
      <div className={`fixed inset-0 z-50 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
        <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} onLogout={() => setIsLoggedIn(false)} />
      </div>

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-40 glass px-4 md:px-8 py-3 md:py-4 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Shield className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" />
              Hope
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-[10px] md:text-xs font-bold text-white uppercase">{userName}</div>
              <div className="text-[8px] md:text-[9px] text-emerald-500 font-mono tracking-tighter uppercase">Vault Open</div>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck size={18} className="text-emerald-500" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full mb-20 md:mb-0">
          {activeTab === 'guardian' && <CallGuardian />}
          {activeTab === 'passport' && <IdentityPassport />}
          {activeTab === 'browser' && <BrowserDetector />}
          {activeTab === 'settings' && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
               <Settings size={40} className="mb-4 text-slate-800" />
               <h2 className="text-xl md:text-2xl font-bold">Cấu hình Hope</h2>
               <p className="max-w-xs mt-2 text-slate-500 text-xs md:text-sm">Quản lý bảo mật cục bộ và các quyền truy cập ứng dụng Hope.</p>
               <button 
                 onClick={() => { if(confirm("Xóa toàn bộ dữ liệu Hope?")) { localStorage.clear(); window.location.reload(); } }}
                 className="mt-8 px-8 py-3 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 Xóa hoàn toàn tài khoản
               </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
