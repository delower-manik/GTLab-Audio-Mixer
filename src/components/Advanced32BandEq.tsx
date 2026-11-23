import React, { useState } from 'react';
import { Sliders, Activity, Check, RotateCcw } from 'lucide-react';

interface Band32Config {
  id: number;
  freq: number;
  gain: number;
  q: number;
  filterType: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking';
  volume: number; // 0-100 knob
}

const DEFAULT_32_BANDS: Band32Config[] = Array.from({ length: 32 }, (_, i) => {
  // logarithmic distribution from 20Hz to 20000Hz
  const freq = Math.round(20 * Math.pow(1000, i / 31));
  return {
    id: i + 1,
    freq: freq > 20000 ? 20000 : freq,
    gain: 0,
    q: 1.4,
    filterType: 'peaking',
    volume: 80
  };
});

export const Advanced32BandEq: React.FC = () => {
  const [bands, setBands] = useState<Band32Config[]>(DEFAULT_32_BANDS);
  const [editingBandId, setEditingBandId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleGainChange = (id: number, gain: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, gain } : b));
  };

  const handleQChange = (id: number, q: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, q } : b));
  };

  const handleVolumeChange = (id: number, volume: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, volume } : b));
  };

  const handleTypeChange = (id: number, filterType: any) => {
    setBands(bands.map(b => b.id === id ? { ...b, filterType } : b));
  };

  const handleReset = () => {
    setBands(DEFAULT_32_BANDS);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Professional 32-Band Master EQ
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">High-Precision 32-Band Parametric Equalizer</h2>
          <p className="text-xs text-slate-400">Customizable frequency filter types, Q factor, gain, and individual volume knobs per band.</p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Bands
        </button>
      </div>

      {/* 32 Bands Scrollable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[65vh] overflow-y-auto pr-2">
        {bands.map((band) => {
          const freqLabel = band.freq >= 1000 ? `${(band.freq / 1000).toFixed(1)}k Hz` : `${band.freq} Hz`;

          return (
            <div key={band.id} className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xl">
              
              {/* Band Header & Filter Type */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">Band {band.id}: {freqLabel}</span>
                <select
                  value={band.filterType}
                  onChange={(e) => handleTypeChange(band.id, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-[10px] rounded-lg px-2 py-1 outline-none focus:border-emerald-500"
                >
                  <option value="peaking">Peaking</option>
                  <option value="lowshelf">Low Shelf</option>
                  <option value="highshelf">High Shelf</option>
                  <option value="lowpass">Low Pass</option>
                  <option value="highpass">High Pass</option>
                  <option value="bandpass">Band Pass</option>
                </select>
              </div>

              {/* Gain Control */}
              <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Gain</span>
                  <span 
                    onClick={() => { setEditingBandId(band.id); setEditValue(band.gain.toString()); }}
                    className="text-emerald-400 font-mono font-bold cursor-pointer hover:underline"
                    title="Tap to enter value"
                  >
                    {band.gain > 0 ? `+${band.gain}` : band.gain} dB
                  </span>
                </div>

                {editingBandId === band.id ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      min="-24"
                      max="24"
                      step="0.5"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs px-2 py-1 rounded border border-emerald-500 outline-none"
                    />
                    <button
                      onClick={() => {
                        handleGainChange(band.id, Number(editValue) || 0);
                        setEditingBandId(null);
                      }}
                      className="px-2 py-1 bg-emerald-600 text-white text-xs rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="range"
                    min="-24"
                    max="24"
                    step="0.5"
                    value={band.gain}
                    onChange={(e) => handleGainChange(band.id, Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                  />
                )}
              </div>

              {/* Q Factor & Volume Knob */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Q</span>
                    <span className="text-emerald-400 font-mono">{band.q.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={band.q}
                    onChange={(e) => handleQChange(band.id, Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Vol</span>
                    <span className="text-emerald-400 font-mono">{band.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={band.volume}
                    onChange={(e) => handleVolumeChange(band.id, Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Level Meter */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-150"
                    style={{ width: `${Math.max(10, Math.min(100, (band.gain + 24) * 2.1))}‰` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500">MTR</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
