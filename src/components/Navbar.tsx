import React from 'react';
import { Sliders, Disc, Activity, Volume2, Cloud, Sparkles, Music, ShieldAlert } from 'lucide-react';

interface Props {
  activeTab: 'player' | 'playlist' | 'mixer' | 'limiter' | 'atmos' | 'mastermix' | 'eq32';
  setActiveTab: (tab: 'player' | 'playlist' | 'mixer' | 'limiter' | 'atmos' | 'mastermix' | 'eq32') => void;
  onOpenDriveModal: () => void;
  playlistCount: number;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenDriveModal, playlistCount }) => {
  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <Sliders className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-wide">PowerAI Audio Lab Pro</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Studio
            </span>
          </div>
          <p className="text-xs text-slate-400">Poweramp-Style AI Stem Mixer & Dolby Atmos Player</p>
        </div>
      </div>

      {/* Nav Tabs matching screenshot & user request */}
      <nav className="flex items-center flex-wrap justify-center bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-inner gap-1">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'player' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Music className="w-4 h-4" /> Player
        </button>

        <button
          onClick={() => setActiveTab('playlist')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'playlist' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Disc className="w-4 h-4" /> Playlist ({playlistCount})
        </button>

        <button
          onClick={() => setActiveTab('mixer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'mixer' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-4 h-4" /> Track Mixer
        </button>

        <button
          onClick={() => setActiveTab('limiter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'limiter' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Limiter/Gate
        </button>

        <button
          onClick={() => setActiveTab('atmos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'atmos' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Dolby Atmos
        </button>

        <button
          onClick={() => setActiveTab('mastermix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'mastermix' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Master Mix
        </button>

        <button
          onClick={() => setActiveTab('eq32')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'eq32' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" /> Pro EQ Studio
        </button>
      </nav>

      {/* Google Drive & Cloud Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDriveModal}
          className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          <Cloud className="w-4 h-4" /> Google Drive
        </button>
      </div>

    </header>
  );
};
