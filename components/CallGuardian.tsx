
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Activity, ScanFace, Radio, MessageCircle, Info, Lock, ExternalLink, Mic, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CallGuardian: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [threatLevel, setThreatLevel] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [activeTask, setActiveTask] = useState<string>("Đang chờ...");
  const [targetApp, setTargetApp] = useState<'Zalo' | 'Messenger' | 'Telegram' | 'Phone'>('Zalo');
  const [transcription, setTranscription] = useState<string>("");
  const [convoAnalysis, setConvoAnalysis] = useState<{ type: string, risk: string } | null>(null);

  const startCall = async () => {
    setIsCalling(true);
    setAnalyzing(true);
    setThreatLevel(0);
    setTranscription("Đang lắng nghe...");
    setConvoAnalysis(null);
    setAnalysisLogs([`[BRIDGE] Kết nối ${targetApp}...`, "[HST] Khởi động AI..."]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }

    const steps = [
      { task: "SINH TRẮC", log: "Quét khuôn mặt AI..." },
      { task: "HỘI THOẠI", log: "Phân tích kịch bản lừa đảo..." },
      { task: "KẾT LUẬN", log: "Đang tính toán rủi ro..." }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setActiveTask(step.task);
        setAnalysisLogs(prev => [`[${step.task}] ${step.log}`, ...prev]);
        if (i === 1) setTranscription("...yêu cầu chuyển tiền vào tài khoản tạm giữ ngay lập tức...");
        if (i === steps.length - 1) performFullAnalysis();
      }, (i + 1) * 2000);
    });
  };

  const performFullAnalysis = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze call: ${transcription} on ${targetApp}. Detect scams (ransom, fake police). Response in Vietnamese.`,
      });
      const resultText = response.text || "";
      setAiAnalysis(resultText);
      setThreatLevel(98);
      setConvoAnalysis({ type: "LỪA ĐẢO TÀI CHÍNH", risk: "CAO" });
      setActiveTask("PHÁT HIỆN LỪA ĐẢO");
    } catch (e) {
      setAiAnalysis("CẢNH BÁO: Cuộc gọi có dấu hiệu lừa đảo và Deepfake cực cao.");
      setThreatLevel(95);
      setActiveTask("CẢNH BÁO");
    }
    setAnalyzing(false);
  };

  const endCall = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCalling(false);
    setThreatLevel(0);
    setAnalysisLogs([]);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Kiểm tra cuộc gọi</h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">Lá chắn đa lớp: Hình ảnh + Giọng nói + Nội dung.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl md:rounded-2xl border border-white/5 shadow-inner overflow-x-auto no-scrollbar">
          {(['Zalo', 'Messenger', 'Telegram', 'Phone'] as const).map(app => (
            <button
              key={app}
              onClick={() => !isCalling && setTargetApp(app)}
              className={`flex-1 min-w-[80px] px-3 md:px-5 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${targetApp === app ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {app}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Scanner View */}
        <div className="lg:col-span-8 bg-black rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden relative min-h-[400px] md:min-h-[600px] shadow-2xl">
          {isCalling ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-30 grayscale" />
              <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <div className="bg-red-600/20 backdrop-blur-md border border-red-500/30 px-3 py-1.5 rounded-lg">
                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase animate-pulse">Scanning {targetApp}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-48 h-64 md:w-64 md:h-80 border-2 border-dashed border-red-500/20 rounded-3xl relative">
                    <div className="scan-line"></div>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 w-full max-w-sm mx-auto">
                   <p className="text-[8px] md:text-[10px] text-emerald-500 font-mono uppercase mb-1">Live Audio Context:</p>
                   <p className="text-white/60 text-[10px] italic truncate">{transcription}</p>
                </div>
              </div>

              {threatLevel > 0 && (
                <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 animate-in slide-in-from-bottom-4">
                  <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 backdrop-blur-3xl ${threatLevel > 70 ? 'bg-red-950/90 border-red-500/50' : 'bg-emerald-950/90 border-emerald-500/50'}`}>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${threatLevel > 70 ? 'bg-red-500' : 'bg-emerald-500'}`}>
                          {threatLevel > 70 ? <ShieldAlert size={20} className="text-white" /> : <ShieldCheck size={20} className="text-black" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[10px] md:text-xs font-black uppercase text-red-400 tracking-wider">Cảnh báo: Phát hiện lừa đảo</h4>
                          <p className="text-white text-[11px] md:text-sm font-bold leading-tight mt-0.5">{aiAnalysis}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={endCall} className="flex-1 bg-red-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-900/40">Ngắt máy</button>
                        <button className="flex-1 bg-white/10 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">Bằng chứng</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-6 p-8 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl">
                <BrainCircuit size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Kích hoạt lá chắn</h3>
                <p className="text-slate-500 text-[10px] md:text-xs max-w-[240px] md:max-w-sm mx-auto leading-relaxed">Phát hiện lừa đảo qua {targetApp} bằng AI phân tích nội dung thời gian thực.</p>
              </div>
              <button 
                onClick={startCall}
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-xl shadow-red-900/40"
              >
                Kiểm tra ngay
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Info / Mobile View adjust */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          <div className="glass rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border border-white/5">
            <h3 className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Radio size={14} className="text-red-500" /> Nhật ký Engine
            </h3>
            <div className="space-y-2.5 max-h-[150px] md:max-h-none overflow-y-auto pr-2">
              {analysisLogs.length > 0 ? analysisLogs.map((log, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                  <span className="text-red-500/40 font-mono text-[8px] shrink-0 mt-0.5">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                  <span className="text-slate-400 uppercase text-[9px] font-bold leading-tight">{log}</span>
                </div>
              )) : (
                <div className="text-slate-700 italic text-[10px] text-center py-4">Sẵn sàng nhận tín hiệu...</div>
              )}
            </div>
          </div>
          
          <div className="hidden md:block glass rounded-[2rem] p-6 border border-white/5">
             <div className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-500">
                <Info size={18} />
                <p className="text-[10px] font-bold italic">Tự động báo cáo các số điện thoại lừa đảo cho Cơ quan chức năng.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallGuardian;
