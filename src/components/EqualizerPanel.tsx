import React, { useState } from 'react';
import { EQ_FREQUENCIES, EQ_PRESETS, audioEngine } from '../services/audioEngine';
import { Activity, Sparkles, Sliders, Check } from 'lucide-react';

interface Props {
  onNotify?: (msg: string) => void;
}

export const EqualizerPanel: React.FC<Props> = () => {
  const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState<string>('Flat');

  const handleGainChange = (index: number, val: number) => {
    const newGains = [...gains];
    newGains[index] = val;
    setGains(newGains);
    setActivePreset('Custom');
    audioEngine.setEqualizerBands(newGains);
  };

  const handleSelectPreset = (presetName: string) => {
    const found = EQ_PRESETS.find(p => p.name === presetName);
    if (found) {
      setGains([...found.gains]);
      setActivePreset(found.name);
      audioEngine.setEqualizerBands(found.gains);
    }
  };

  const resetEq = () => {
    const flat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    setGains(flat);
    setActivePreset('Flat');
    audioEngine.setEqualizerBands(flat);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> 10-Band Graphic Equalizer
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Master Equalizer & Acoustic Shaping</h2>
          <p className="text-xs text-slate-400">Fine-tune frequency spectrum response with pro presets and real-time WebAudio filters.</p>
        </div>

        <button
          onClick={resetEq}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
        >
          Reset Equalizer
        </button>
      </div>

      {/* Presets */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acoustic Presets</h3>
        <div className="flex flex-wrap gap-2">
          {EQ_PRESETS.map((preset) => {
            const isActive = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isActive && <Check className="w-3.5 h-3.5" />}
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Band Vertical Faders */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-6">
          {EQ_FREQUENCIES.map((freq, idx) => {
            const gain = gains[idx];
            const freqLabel = freq >= 1000 ? `${freq / 1000}kHz` : `${freq}Hz`;

            return (
              <div key={freq} className="flex flex-col items-center space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {gain > 0 ? `+${gain}` : gain} dB
                </span>

                {/* Vertical Range Input */}
                <div className="h-48 flex items-center justify-center relative py-2">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={gain}
                    onChange={(e) => handleGainChange(idx, Number(e.target.value))}
                    className="w-44 -rotate-90 accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  {freqLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
