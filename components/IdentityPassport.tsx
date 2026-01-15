
import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, QrCode, Key, Users, CheckCircle2, Plus, User, AlertCircle } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  status: string;
  avatar: string;
  isOwner?: boolean;
}

const IdentityPassport: React.FC = () => {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const ownerName = localStorage.getItem('sot_user_name') || 'Chủ sở hữu';

  useEffect(() => {
    const saved = localStorage.getItem('sot_family_circle');
    if (saved) {
      setFamily(JSON.parse(saved));
    } else {
      // Trạng thái sơ khai nhất: Chỉ có chính người dùng
      const initial = [
        { 
          id: 'owner', 
          name: `${ownerName}`, 
          status: "Chủ Vault", 
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${ownerName}`, 
          isOwner: true 
        },
      ];
      setFamily(initial);
      localStorage.setItem('sot_family_circle', JSON.stringify(initial));
    }
  }, [ownerName]);

  const addMember = () => {
    if (!newName.trim()) return;
    const newMember = {
      id: Date.now().toString(),
      name: newName.trim(),
      status: "Chờ xác thực P2P",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newName.trim()}`
    };
    const updated = [...family, newMember];
    setFamily(updated);
    localStorage.setItem('sot_family_circle', JSON.stringify(updated));
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Hộ chiếu Gia đình</h2>
          <p className="text-slate-500 mt-1">Mạng lưới tin cậy của <span className="text-emerald-500 font-bold">{ownerName}</span>.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus size={18} />
          Thêm thành viên mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0c14]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                <Users size={18} className="text-emerald-500" />
                Vòng kết nối tin cậy
              </h3>
            </div>

            {isAdding && (
              <div className="p-8 bg-emerald-500/[0.02] border-b border-white/5 animate-in slide-in-from-top-4">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase text-center">Thiết lập kết nối P2P mới</p>
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Tên người thân (Bố, Mẹ, Anh...)"
                      className="flex-1 bg-black border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addMember()}
                    />
                    <button onClick={addMember} className="bg-emerald-600 px-6 rounded-2xl font-bold text-sm">Xác nhận</button>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="w-full text-slate-600 text-[10px] font-bold uppercase">Hủy bỏ</button>
                </div>
              </div>
            )}

            <div className="divide-y divide-white/5">
              {family.length <= 1 && !isAdding && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-700">
                    <Users size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">Chưa có người thân nào</p>
                    <p className="text-[10px] text-slate-600 max-w-[200px] mx-auto uppercase tracking-tighter">Bấm nút "Thêm" để bắt đầu xây dựng lá chắn gia đình của bạn.</p>
                  </div>
                </div>
              )}
              
              {family.map((member) => (
                <div key={member.id} className={`p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group ${member.isOwner ? 'bg-emerald-500/[0.01]' : ''}`}>
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                        <img src={member.avatar} className={`w-full h-full object-cover ${member.isOwner ? '' : 'grayscale group-hover:grayscale-0'} transition-all`} alt={member.name} />
                      </div>
                      {member.isOwner && (
                        <div className="absolute -top-2 -right-2 bg-emerald-600 rounded-full p-1 shadow-lg">
                          <ShieldCheck size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-lg tracking-tight">{member.name}</div>
                      <div className="text-[10px] flex items-center gap-2 mt-1">
                        {member.isOwner ? (
                          <span className="text-emerald-500 font-mono font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Vault Master</span>
                        ) : (
                          <span className="text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-slate-700" /> Peer-to-Peer Link
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${member.isOwner ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/10'}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Quy tắc 01</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-8 opacity-90">
                Khi nhận được yêu cầu chuyển tiền từ người thân, hãy luôn yêu cầu họ thực hiện một hành động ngẫu nhiên (như sờ tai) để xác minh Deepfake.
              </p>
              <button className="w-full bg-black/20 hover:bg-black/30 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                Xem hướng dẫn an toàn
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 text-white/10">
              <ShieldCheck size={200} />
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5">
              <Key size={18} className="text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Mã hầm chứa</p>
              <p className="text-xs font-mono text-emerald-500 mt-0.5 truncate max-w-[150px]">
                {localStorage.getItem('sot_vault_id') || '---'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityPassport;
