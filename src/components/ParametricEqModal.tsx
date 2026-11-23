import React from 'react';
import { AudioStem, ParametricEqBand } from '../types';
import { X, Sliders, CheckCircle2 } from 'lucide-react';

interface Props {
  stem: AudioStem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBands: ParametricEqBand[]) => void;
}

export const ParametricEqModal: React.FC<Props> = ({ stem, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const handleBandChange = (index: number, field: keyof ParametricEqBand, value: number | boolean) => {
    const newBands = [...stem.eqBands];
    newBands[index] = { ...newBands[index], [field]: value };
    onUpdate(newBands);
  };

  const addBand = () => {
    const newBands = [...stem.eqBands, { frequency: 2000, gain: 0, q: 1.4, enabled: true }];
    onUpdate(newBands);
  };

  const removeBand = (index: number) => {
    const newBands = stem.eqBands.filter((_, i) => i !== index);
    onUpdate(newBands);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: stem.color }}>
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Parametric EQ: <span className="text-emerald-400">{stem.name}</span>
              </h3>
              <p className="text-xs text-slate-400">{stem.label}</p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Multi-Band Parametric Filter</h4>
              <p className="text-xs text-slate-400">Customize frequency peaks, Q factor, and gain for surgical audio shaping.</p>
            </div>
            <button
              onClick={addBand}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              + Add EQ Band
            </button>
          </div>

          <div className="space-y-4">
            {stem.eqBands.map((band, idx) => (
              <div key={idx} className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={band.enabled}
                      onChange={(e) => handleBandChange(idx, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-white">Band {idx + 1}</span>
                  </div>
                  <button
                    onClick={() => removeBand(idx)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Frequency */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Frequency</span>
                      <span className="text-emerald-400 font-mono">{band.frequency} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="20000"
                      step="10"
                      value={band.frequency}
                      disabled={!band.enabled}
                      onChange={(e) => handleBandChange(idx, 'frequency', Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer disabled:opacity-50"
                    />
                  </div>

                  {/* Gain */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Gain</span>
                      <span className="text-emerald-400 font-mono">{band.gain > 0 ? `+${band.gain}` : band.gain} dB</span>
                    </div>
                    <input
                      type="range"
                      min="-24"
                      max="24"
                      step="0.5"
                      value={band.gain}
                      disabled={!band.enabled}
                      onChange={(e) => handleBandChange(idx, 'gain', Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer disabled:opacity-50"
                    />
                  </div>

                  {/* Q Factor */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Q Factor</span>
                      <span className="text-emerald-400 font-mono">{band.q.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={band.q}
                      disabled={!band.enabled}
                      onChange={(e) => handleBandChange(idx, 'q', Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            ))}
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
