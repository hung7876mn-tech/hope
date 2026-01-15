
import React from 'react';
import { Phone, Fingerprint, Globe, Settings, Shield, Lock, LogOut, ShieldAlert, X } from 'lucide-react';
import { ActiveTab } from '../App';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'guardian', icon: ShieldAlert, label: 'Kiểm tra lừa đảo', sub: 'CẢNH BÁO AI' },
    { id: 'passport', icon: Fingerprint, label: 'Hộ chiếu Gia đình', sub: 'MÃ HÓA P2P' },
    { id: 'browser', icon: Globe, label: 'Media Check', sub: 'KIỂM TOÁN TIN GIẢ' },
    { id: 'settings', icon: Settings, label: 'Cấu hình', sub: 'LOCAL SYSTEM' },
  ];

  return (
    <aside className="w-72 md:w-80 bg-[#05070f] border-r border-white/5 flex flex-col h-full relative">
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Shield className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none text-white uppercase">HOPE</span>
              <span className="text-[10px] text-emerald-500 font-mono tracking-[0.25em]">SECURE LINK</span>
            </div>
          </div>
        </div>

        <nav className="space-y-2 md:space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl md:rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'group-hover:text-emerald-500'} />
              <div className="text-left">
                <div className="text-sm font-bold tracking-tight">{item.label}</div>
                <div className="text-[9px] font-mono tracking-widest opacity-60 mt-0.5">{item.sub}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 md:p-8 border-t border-white/5 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 md:p-4 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
        
        <div className="hidden md:block bg-white/5 rounded-3xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-500">Hệ thống an toàn</span>
          </div>
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">End-to-End Encryption</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
