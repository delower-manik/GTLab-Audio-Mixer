import React from 'react';
import { AudioStem, LimiterSettings } from '../types';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  stem: AudioStem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (limiter: LimiterSettings) => void;
}

export const LimiterModal: React.FC<Props> = ({ stem, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const lim = stem.limiter;

  const handleChange = (field: keyof LimiterSettings, value: any) => {
    onUpdate({ ...lim, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: stem.color }}>
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Limiter & Compressor: <span className="text-emerald-400">{stem.name}</span>
              </h3>
              <p className="text-xs text-slate-400">Manage dynamic range compression, brickwall limiting, and noise gate.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/50">
          
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <h4 className="text-sm font-medium text-white">Dynamics Processor Active</h4>
              <p className="text-xs text-slate-400">Prevents digital clipping and controls audio transients.</p>
            </div>
            <button
              onClick={() => handleChange('enabled', !lim.enabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${!lim.enabled ? 'bg-slate-800' : 'bg-emerald-600'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${!lim.enabled ? 'translate-x-0' : 'translate-x-6'}`} />
            </button>
          </div>

          <div className={`space-y-4 transition-opacity ${!lim.enabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Threshold & Ratio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Threshold</span>
                  <span className="text-emerald-400 font-mono">{lim.threshold} dB</span>
                </div>
                <input
                  type="range" min="-40" max="0" step="0.5"
                  value={lim.threshold}
                  onChange={(e) => handleChange('threshold', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Compression Ratio</span>
                  <span className="text-emerald-400 font-mono">{lim.ratio}:1</span>
                </div>
                <input
                  type="range" min="1" max="20" step="0.5"
                  value={lim.ratio}
                  onChange={(e) => handleChange('ratio', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Attack & Release */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Attack Time</span>
                  <span className="text-emerald-400 font-mono">{lim.attack} ms</span>
                </div>
                <input
                  type="range" min="0.1" max="100" step="0.5"
                  value={lim.attack}
                  onChange={(e) => handleChange('attack', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Release Time</span>
                  <span className="text-emerald-400 font-mono">{lim.release} ms</span>
                </div>
                <input
                  type="range" min="10" max="1000" step="5"
                  value={lim.release}
                  onChange={(e) => handleChange('release', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Makeup Gain & Noise Gate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Makeup Gain</span>
                  <span className="text-emerald-400 font-mono">+{lim.makeupGain} dB</span>
                </div>
                <input
                  type="range" min="0" max="24" step="0.5"
                  value={lim.makeupGain}
                  onChange={(e) => handleChange('makeupGain', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Noise Gate Threshold</span>
                  <span className="text-emerald-400 font-mono">{lim.noiseGateThreshold} dB</span>
                </div>
                <input
                  type="range" min="-80" max="-20" step="1"
                  value={lim.noiseGateThreshold}
                  onChange={(e) => handleChange('noiseGateThreshold', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/50 gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
