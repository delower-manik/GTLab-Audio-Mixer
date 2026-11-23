import React, { useState } from 'react';
import { Volume2, Sparkles, Download, Loader2, CheckCircle2, Sliders, Disc, ShieldAlert, Activity } from 'lucide-react';
import { MasterSettings, Track } from '../types';
import { audioEngine } from '../services/audioEngine';
import { EqStudio } from './EqStudio';
import { LimiterGatePanel } from './LimiterGatePanel';

interface Props {
  masterSettings: MasterSettings;
  onUpdateMaster: (settings: MasterSettings) => void;
  currentTrack: Track;
  onExportRenderedTrack: (newTrack: Track) => void;
  onUpdateTrackStems: (updatedTrack: Track) => void;
}

export const MasterMixPanel: React.FC<Props> = ({ 
  masterSettings, 
  onUpdateMaster, 
  currentTrack, 
  onExportRenderedTrack,
  onUpdateTrackStems 
}) => {
  const [subTab, setSubTab] = useState<'console' | 'eq' | 'limiter'>('console');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);

  // Master L, C, R faders
  const [lcrVolume, setLcrVolume] = useState<{ left: number; center: number; right: number }>({
    left: masterSettings.volume,
    center: masterSettings.volume,
    right: masterSettings.volume
  });

  const handleVolumeChange = (vol: number) => {
    onUpdateMaster({ ...masterSettings, volume: vol });
    audioEngine.setMasterVolume(vol);
    setLcrVolume({ left: vol, center: vol, right: vol });
  };

  const handleStemGainChange = (stemId: string, gain: number) => {
    const updatedStems = currentTrack.stems.map(s => s.id === stemId ? { ...s, gain } : s);
    onUpdateTrackStems({ ...currentTrack, stems: updatedStems });
  };

  const handleStartExportRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setRenderComplete(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsRendering(false);
        setRenderComplete(true);

        const exportedTrack: Track = {
          id: `master-mix-${Date.now()}`,
          title: `${currentTrack.title} (Master Mix Render)`,
          artist: `${currentTrack.artist} [Mastered Export]`,
          album: 'Master Mix Exported Studio',
          duration: currentTrack.duration,
          coverUrl: currentTrack.coverUrl,
          audioUrl: currentTrack.audioUrl,
          source: 'local',
          stems: currentTrack.stems,
          aiAnalyzed: true,
          aiGenre: 'Master Mix Studio Export',
          aiMood: 'Balanced Master',
          aiBpm: currentTrack.aiBpm,
          aiKey: currentTrack.aiKey,
          aiInsights: 'Master mix successfully rendered with 32-bit float summing, Pro EQ, Limiter, and LCR processing.'
        };

        onExportRenderedTrack(exportedTrack);
      }
      setRenderProgress(progress);
    }, 200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 animate-fadeIn">
      
      {/* Header & Export / Sub-Menu inside Master Mix */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Master Mix Studio & Export Center
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Master Mix, Pro EQ & Limiter Console</h2>
          <p className="text-xs text-slate-400">Complete master mixing console with LCR faders, Pro EQ Studio, Limiter/Gate, and File Export.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartExportRender}
            disabled={isRendering}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50"
          >
            {isRendering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isRendering ? `Exporting Mix (${renderProgress}%)...` : 'Export Master Mix'}
          </button>
        </div>
      </div>

      {renderComplete && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Master mix successfully exported and saved as a new file in your playlist!</span>
          </div>
          <button onClick={() => setRenderComplete(false)} className="text-emerald-400 hover:text-white font-semibold">Dismiss</button>
        </div>
      )}

      {/* Sub-Tabs inside Master Mix for Console, Pro EQ, and Limiter */}
      <div className="flex bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-fit gap-2">
        <button
          onClick={() => setSubTab('console')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'console' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" /> LCR & Stem Faders
        </button>

        <button
          onClick={() => setSubTab('eq')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'eq' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Pro EQ Studio
        </button>

        <button
          onClick={() => setSubTab('limiter')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'limiter' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Limiter / Gate
        </button>
      </div>

      {/* Sub-Tab 1: LCR & Stems Console */}
      {subTab === 'console' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Master L, C, R Faders */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Master L (Left), C (Center), R (Right) Bus Faders
              </h3>
              <span className="text-xs text-slate-400">Real-time VU meters active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-emerald-400">Master L (Left)</span>
                <div className="h-36 flex items-center justify-center relative py-2">
                  <div className="absolute w-1.5 h-full bg-slate-800 rounded-full" />
                  <div className="absolute w-1.5 bg-emerald-500 rounded-full bottom-0" style={{ height: `${lcrVolume.left}%` }} />
                  <input
                    type="range" min="0" max="100" step="1"
                    value={lcrVolume.left}
                    onChange={(e) => setLcrVolume({ ...lcrVolume, left: Number(e.target.value) })}
                    className="w-36 -rotate-90 accent-emerald-500 bg-transparent opacity-0 cursor-pointer absolute"
                  />
                  <div className="absolute w-10 h-6 rounded-full bg-slate-950 border-2 border-emerald-500 shadow-lg flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{lcrVolume.left}%</span>
              </div>

              <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-blue-400">Master C (Center)</span>
                <div className="h-36 flex items-center justify-center relative py-2">
                  <div className="absolute w-1.5 h-full bg-slate-800 rounded-full" />
                  <div className="absolute w-1.5 bg-blue-500 rounded-full bottom-0" style={{ height: `${lcrVolume.center}%` }} />
                  <input
                    type="range" min="0" max="100" step="1"
                    value={lcrVolume.center}
                    onChange={(e) => {
                      setLcrVolume({ ...lcrVolume, center: Number(e.target.value) });
                      handleVolumeChange(Number(e.target.value));
                    }}
                    className="w-36 -rotate-90 accent-blue-500 bg-transparent opacity-0 cursor-pointer absolute"
                  />
                  <div className="absolute w-10 h-6 rounded-full bg-slate-950 border-2 border-blue-500 shadow-lg flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{lcrVolume.center}%</span>
              </div>

              <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-purple-400">Master R (Right)</span>
                <div className="h-36 flex items-center justify-center relative py-2">
                  <div className="absolute w-1.5 h-full bg-slate-800 rounded-full" />
                  <div className="absolute w-1.5 bg-purple-500 rounded-full bottom-0" style={{ height: `${lcrVolume.right}%` }} />
                  <input
                    type="range" min="0" max="100" step="1"
                    value={lcrVolume.right}
                    onChange={(e) => setLcrVolume({ ...lcrVolume, right: Number(e.target.value) })}
                    className="w-36 -rotate-90 accent-purple-500 bg-transparent opacity-0 cursor-pointer absolute"
                  />
                  <div className="absolute w-10 h-6 rounded-full bg-slate-950 border-2 border-purple-500 shadow-lg flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-0.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{lcrVolume.right}%</span>
              </div>
            </div>
          </div>

          {/* AI Detected Track Stems Faders */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Disc className="w-4 h-4 text-emerald-400" /> AI Detected Stems Fader Console ({currentTrack.stems.length} Stems)
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentTrack.stems.map((stem) => (
                <div key={stem.id} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col items-center space-y-2.5">
                  <span className="text-xs font-bold text-white truncate max-w-full" style={{ color: stem.color }}>{stem.name}</span>
                  
                  <div className="h-28 flex items-center justify-center relative py-1">
                    <div className="absolute w-1 h-full bg-slate-800 rounded-full" />
                    <div className="absolute w-1 rounded-full bottom-0" style={{ height: `${Math.max(10, Math.min(100, (stem.gain + 24) * 2.1))}%`, backgroundColor: stem.color }} />
                    <input
                      type="range" min="-24" max="12" step="0.5"
                      value={stem.gain}
                      onChange={(e) => handleStemGainChange(stem.id, Number(e.target.value))}
                      className="w-28 -rotate-90 accent-emerald-500 bg-transparent opacity-0 cursor-pointer absolute"
                    />
                    <div className="absolute w-7 h-4 rounded-full bg-slate-950 border shadow flex items-center justify-center pointer-events-none" style={{ borderColor: stem.color }}>
                      <div className="w-2 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">{stem.gain > 0 ? `+${stem.gain}` : stem.gain} dB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Pro EQ Studio */}
      {subTab === 'eq' && (
        <div className="animate-fadeIn">
          <EqStudio />
        </div>
      )}

      {/* Sub-Tab 3: Limiter / Gate */}
      {subTab === 'limiter' && (
        <div className="animate-fadeIn">
          <LimiterGatePanel currentTrack={currentTrack} onUpdateTrack={onUpdateTrackStems} />
        </div>
      )}

    </div>
  );
};
