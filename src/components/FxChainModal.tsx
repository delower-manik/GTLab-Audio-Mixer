import React, { useState } from 'react';
import { AudioStem, FxChannel } from '../types';
import { X, Wand2, CheckCircle2 } from 'lucide-react';

interface Props {
  stem: AudioStem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (fx1: FxChannel, fx2: FxChannel) => void;
}

export const FxChainModal: React.FC<Props> = ({ stem, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const [activeChannel, setActiveChannel] = useState<1 | 2>(1);
  const [fx1, setFx1] = useState<FxChannel>({ ...stem.fxChannel1 });
  const [fx2, setFx2] = useState<FxChannel>({ ...stem.fxChannel2 });

  const currentFx = activeChannel === 1 ? fx1 : fx2;
  const setCurrentFx = activeChannel === 1 ? setFx1 : setFx2;

  const handleChange = (field: keyof FxChannel, value: any) => {
    const updated = { ...currentFx, [field]: value };
    if (activeChannel === 1) {
      setFx1(updated);
      onUpdate(updated, fx2);
    } else {
      setFx2(updated);
      onUpdate(fx1, updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: stem.color }}>
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                FX Chain (Reverb & Effects): <span className="text-emerald-400">{stem.name}</span>
              </h3>
              <p className="text-xs text-slate-400">Configure 2 independent effect channels with EQ and dry/wet mix.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveChannel(1)}
            className={`px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
              activeChannel === 1 
                ? 'bg-slate-900 border-slate-700 text-emerald-400 shadow-md' 
                : 'bg-transparent border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Channel 1: {fx1.effectType.toUpperCase()} {fx1.bypass ? '(Bypassed)' : ''}
          </button>
          <button
            onClick={() => setActiveChannel(2)}
            className={`px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
              activeChannel === 2 
                ? 'bg-slate-900 border-slate-700 text-emerald-400 shadow-md' 
                : 'bg-transparent border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Channel 2: {fx2.effectType.toUpperCase()} {fx2.bypass ? '(Bypassed)' : ''}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/50">
          
          {/* Top Controls: Effect Type & Bypass */}
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-4">
              <label className="text-xs text-slate-400 font-medium">Effect Type:</label>
              <select
                value={currentFx.effectType}
                onChange={(e) => handleChange('effectType', e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="reverb">Studio Reverb</option>
                <option value="echo">Echo / Tap Delay</option>
                <option value="delay">Stereo Delay</option>
                <option value="chorus">Chorus Ensemble</option>
                <option value="flanger">Flanger</option>
                <option value="distortion">Overdrive / Distortion</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Bypass Effect</span>
              <button
                onClick={() => handleChange('bypass', !currentFx.bypass)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${currentFx.bypass ? 'bg-slate-800' : 'bg-emerald-600'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentFx.bypass ? 'translate-x-0' : 'translate-x-6'}`} />
              </button>
            </div>
          </div>

          <div className={`space-y-6 transition-opacity ${currentFx.bypass ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {/* Gains grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Input Gain</span>
                  <span className="text-emerald-400 font-mono">{currentFx.inputGain} dB</span>
                </div>
                <input
                  type="range" min="-12" max="12" step="0.5"
                  value={currentFx.inputGain}
                  onChange={(e) => handleChange('inputGain', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Effect Intensity</span>
                  <span className="text-emerald-400 font-mono">{currentFx.effectGain}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="1"
                  value={currentFx.effectGain}
                  onChange={(e) => handleChange('effectGain', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Dry / Wet Mix</span>
                  <span className="text-emerald-400 font-mono">{currentFx.dryWetMix}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="1"
                  value={currentFx.dryWetMix}
                  onChange={(e) => handleChange('dryWetMix', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Effect EQ */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase">Effect Equalizer (Low / Mid / High)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>EQ Low</span>
                    <span className="text-emerald-400 font-mono">{currentFx.effectEqLow} dB</span>
                  </div>
                  <input
                    type="range" min="-12" max="12" step="0.5"
                    value={currentFx.effectEqLow}
                    onChange={(e) => handleChange('effectEqLow', Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>EQ Mid</span>
                    <span className="text-emerald-400 font-mono">{currentFx.effectEqMid} dB</span>
                  </div>
                  <input
                    type="range" min="-12" max="12" step="0.5"
                    value={currentFx.effectEqMid}
                    onChange={(e) => handleChange('effectEqMid', Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>EQ High</span>
                    <span className="text-emerald-400 font-mono">{currentFx.effectEqHigh} dB</span>
                  </div>
                  <input
                    type="range" min="-12" max="12" step="0.5"
                    value={currentFx.effectEqHigh}
                    onChange={(e) => handleChange('effectEqHigh', Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>
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
