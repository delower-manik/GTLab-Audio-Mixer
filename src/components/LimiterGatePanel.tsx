import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';
import { LimiterSettings, Track } from '../types';

interface Props {
  currentTrack: Track;
  onUpdateTrack: (track: Track) => void;
}

export const LimiterGatePanel: React.FC<Props> = ({ currentTrack, onUpdateTrack }) => {
  const [limiter, setLimiter] = useState<LimiterSettings>(currentTrack.stems[0]?.limiter || {
    threshold: -8,
    ratio: 4,
    attack: 5,
    release: 80,
    makeupGain: 2,
    noiseGateThreshold: -50,
    enabled: true
  });

  const handleLimiterChange = (field: keyof LimiterSettings, value: any) => {
    const updated = { ...limiter, [field]: value };
    setLimiter(updated);

    // Update first stem or all stems
    const updatedStems = currentTrack.stems.map(s => ({ ...s, limiter: updated }));
    onUpdateTrack({ ...currentTrack, stems: updatedStems });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Limiter & Noise Gate Studio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Dynamic Compression & Brickwall Limiter</h2>
          <p className="text-xs text-slate-400">Control peak levels, dynamic range compression, transient attack, and noise gate threshold.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLimiterChange('enabled', !limiter.enabled)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              limiter.enabled ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            Limiter {limiter.enabled ? 'Active' : 'Bypassed'}
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className={`bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 transition-all ${!limiter.enabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Threshold</span>
              <span className="text-amber-400 font-mono font-bold">{limiter.threshold} dB</span>
            </div>
            <input
              type="range" min="-40" max="0" step="0.5"
              value={limiter.threshold}
              onChange={(e) => handleLimiterChange('threshold', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Compression Ratio</span>
              <span className="text-amber-400 font-mono font-bold">{limiter.ratio}:1</span>
            </div>
            <input
              type="range" min="1" max="20" step="0.5"
              value={limiter.ratio}
              onChange={(e) => handleLimiterChange('ratio', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Attack Time</span>
              <span className="text-amber-400 font-mono font-bold">{limiter.attack} ms</span>
            </div>
            <input
              type="range" min="0.1" max="100" step="0.5"
              value={limiter.attack}
              onChange={(e) => handleLimiterChange('attack', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Release Time</span>
              <span className="text-amber-400 font-mono font-bold">{limiter.release} ms</span>
            </div>
            <input
              type="range" min="10" max="1000" step="5"
              value={limiter.release}
              onChange={(e) => handleLimiterChange('release', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Makeup Gain</span>
              <span className="text-amber-400 font-mono font-bold">+{limiter.makeupGain} dB</span>
            </div>
            <input
              type="range" min="0" max="24" step="0.5"
              value={limiter.makeupGain}
              onChange={(e) => handleLimiterChange('makeupGain', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Noise Gate Threshold</span>
              <span className="text-amber-400 font-mono font-bold">{limiter.noiseGateThreshold} dB</span>
            </div>
            <input
              type="range" min="-80" max="-20" step="1"
              value={limiter.noiseGateThreshold}
              onChange={(e) => handleLimiterChange('noiseGateThreshold', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
