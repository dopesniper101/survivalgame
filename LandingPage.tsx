
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [view, setView] = useState<'main' | 'manual' | 'comms' | 'settings'>('main');

  const renderContent = () => {
    switch (view) {
      case 'manual':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-orange-500 font-black text-xl italic tracking-tighter">FIELD MANUAL v1.0</h2>
            <div className="space-y-4 text-stone-300 text-xs font-bold leading-relaxed uppercase tracking-widest">
              <p><span className="text-white">Movement:</span> W/A/S/D to navigate the wasteland. SHIFT to sprint (consumes stamina).</p>
              <p><span className="text-white">Harvesting:</span> Approach trees or rocks and use your tool (LMB or E) to gather resources.</p>
              <p><span className="text-white">Survival:</span> Keep an eye on your Hunger and Thirst. Kill animals for meat and consume it using [E].</p>
              <p><span className="text-white">Stealth:</span> Use [CTRL] to crouch and stay low. It reduces your noise profile.</p>
            </div>
            <button onClick={() => setView('main')} className="mt-8 text-orange-600 font-black text-[10px] tracking-[0.4em] hover:text-white transition-colors">BACK TO TERMINAL</button>
          </div>
        );
      case 'comms':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-orange-500 font-black text-xl italic tracking-tighter">SECURE COMMS</h2>
            <div className="space-y-2 text-stone-400 text-[10px] font-mono leading-none">
              <p className="text-green-800">[14:22:01] SECURE UPLINK ESTABLISHED</p>
              <p>[14:23:45] SECTOR 7G REPORT: RADIATION LEVELS STABILIZING</p>
              <p>[14:25:12] WARNING: ANOMALOUS BIOMETRIC SIGNATURES DETECTED IN QUADRANT B</p>
              <p className="text-red-900">[14:28:99] CRITICAL: OUTPOST 12 SILENT. INVESTIGATION REQUIRED.</p>
              <p>[14:30:00] STANDBY FOR FURTHER INSTRUCTION...</p>
            </div>
            <button onClick={() => setView('main')} className="mt-8 text-orange-600 font-black text-[10px] tracking-[0.4em] hover:text-white transition-colors">BACK TO TERMINAL</button>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-orange-500 font-black text-xl italic tracking-tighter">BOOT CONFIG</h2>
            <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Master Volume</span>
                  <div className="w-24 h-1 bg-orange-600" />
               </div>
               <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Neural Link Sync</span>
                  <span className="text-green-600 text-[10px] font-black uppercase">Active</span>
               </div>
               <div className="flex justify-between items-center border-b border-stone-800 pb-2 opacity-50">
                  <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Anti-Aliasing</span>
                  <span className="text-stone-600 text-[10px] font-black uppercase">Locked</span>
               </div>
            </div>
            <button onClick={() => setView('main')} className="mt-8 text-orange-600 font-black text-[10px] tracking-[0.4em] hover:text-white transition-colors">BACK TO TERMINAL</button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-6 max-w-sm ml-4">
            <button 
              onClick={onStart}
              className="group relative flex items-center justify-between bg-orange-600 hover:bg-white text-white hover:text-orange-600 font-black py-6 px-10 rounded-sm transition-all hover:translate-x-8 border-b-8 border-orange-900 shadow-xl active:translate-y-2 active:border-b-0"
            >
              <span className="text-3xl italic tracking-tighter">WAKE UP</span>
              <span className="text-3xl transition-transform group-hover:translate-x-4">→</span>
            </button>
            
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={() => setView('manual')} className="text-left text-stone-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] py-2 px-10 transition-all hover:translate-x-2 border-l-2 border-transparent hover:border-orange-600">
                Field Manual
              </button>
              <button onClick={() => setView('comms')} className="text-left text-stone-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] py-2 px-10 transition-all hover:translate-x-2 border-l-2 border-transparent hover:border-orange-600">
                Secure Comms
              </button>
              <button onClick={() => setView('settings')} className="text-left text-stone-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] py-2 px-10 transition-all hover:translate-x-2 border-l-2 border-transparent hover:border-orange-600">
                Settings
              </button>
              <button onClick={() => window.close()} className="text-left text-red-900/40 hover:text-red-600 font-black text-xs uppercase tracking-[0.3em] py-2 px-10 transition-all hover:translate-x-2 border-l-2 border-transparent hover:border-red-600 mt-4">
                Terminate
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0c0a09] flex flex-col justify-between p-12 overflow-hidden">
      {/* Cinematic Background Simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09] via-transparent to-[#0c0a09] z-10" />
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center grayscale contrast-150" />
        <div className="absolute inset-0 bg-orange-950/20 mix-blend-overlay" />
      </div>

      {/* Header Area */}
      <div className="z-20">
        <h1 className="text-9xl font-black text-white game-font tracking-[0.2em] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-none italic">
          RUSTED
        </h1>
        <div className="flex items-center gap-4 mt-4 ml-2">
           <div className="h-0.5 w-12 bg-orange-600" />
           <p className="text-orange-600 font-black tracking-[0.6em] text-sm uppercase">Wasteland Survival Simulation</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="z-20 flex min-h-[300px]">
        {renderContent()}
      </div>

      {/* Footer Info */}
      <div className="z-20 flex justify-between items-end">
        <div className="max-w-md bg-stone-900/60 p-8 backdrop-blur-xl border-l-4 border-orange-600 shadow-2xl">
          <h3 className="text-orange-500 font-black mb-3 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
            Transmitting: ALPHA V0.2.8
          </h3>
          <p className="text-stone-300 text-[11px] font-bold leading-relaxed italic opacity-80">
            "The concrete is cold. The air is poison. Trust the rock in your hand more than the man in your shadow."
          </p>
        </div>
        <div className="text-right space-y-2">
          <div className="flex gap-4 justify-end">
             <div className="w-8 h-1 bg-stone-800" />
             <div className="w-8 h-1 bg-orange-600" />
             <div className="w-8 h-1 bg-stone-800" />
          </div>
          <p className="text-stone-600 text-[9px] game-font uppercase tracking-[0.4em] font-black">
            © 2024 WASTETECH BIOMETRICS • SECTOR 7G
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
