import React, { useState } from 'react';
import { Sliders, Activity, RotateCcw, Palette, Check, Disc, Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface BandConfig {
  id: number;
  freq: number; // Hz
  gain: number; // dB (-24 to +24)
  q: number; // Q factor (0.1 to 10)
  filterType: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking';
  color: string;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', 
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f43f5e', '#a855f7', '#38bdf8', '#4ade80', '#fbbf24'
];

const DEFAULT_32_BANDS: BandConfig[] = Array.from({ length: 32 }, (_, i) => {
  const freq = Math.round(20 * Math.pow(1000, i / 31));
  return {
    id: i + 1,
    freq: freq > 20000 ? 20000 : freq,
    gain: 0,
    q: 1.4,
    filterType: 'peaking',
    color: PRESET_COLORS[i % PRESET_COLORS.length]
  };
});

export const EqStudio: React.FC = () => {
  const [eqMode, setEqMode] = useState<'peq' | 'eq'>('peq');
  const [targetScope, setTargetScope] = useState<'master' | 'track'>('master');
  const [bands, setBands] = useState<BandConfig[]>(DEFAULT_32_BANDS);
  const [activeColorPickerBandId, setActiveColorPickerBandId] = useState<number | null>(null);

  const [editingField, setEditingField] = useState<{ id: number; field: 'gain' | 'freq' | 'q' } | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  const handleGainChange = (id: number, gain: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, gain: Math.max(-24, Math.min(24, gain)) } : b));
    if (targetScope === 'master') {
      audioEngine.setEqualizerBands(bands.map(b => b.gain));
    }
  };

  const handleFreqChange = (id: number, freq: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, freq: Math.max(20, Math.min(20000, freq)) } : b));
  };

  const handleQChange = (id: number, q: number) => {
    setBands(bands.map(b => b.id === id ? { ...b, q: Math.max(0.1, Math.min(10, q)) } : b));
  };

  const handleTypeChange = (id: number, filterType: any) => {
    setBands(bands.map(b => b.id === id ? { ...b, filterType } : b));
  };

  const handleColorChange = (id: number, color: string) => {
    setBands(bands.map(b => b.id === id ? { ...b, color } : b));
    setActiveColorPickerBandId(null);
  };

  const handleReset = () => {
    setBands(DEFAULT_32_BANDS);
    if (targetScope === 'master') {
      audioEngine.setEqualizerBands(Array(32).fill(0));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 animate-fadeIn">
      
      {/* Top Banner & Mode Switchers */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> 32-Band Hardware Pro EQ Studio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Advanced PEQ & Graphic EQ Console</h2>
          <p className="text-xs text-slate-400">Hardware rotary knobs, vertical pill faders, individual band color customizer, and multi-curve spectrum.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setEqMode('peq')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                eqMode === 'peq' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              PEQ (32 Band)
            </button>
            <button
              onClick={() => setEqMode('eq')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                eqMode === 'eq' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Graphic EQ (32)
            </button>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTargetScope('master')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                targetScope === 'master' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master EQ
            </button>
            <button
              onClick={() => setTargetScope('track')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                targetScope === 'track' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Track EQ
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
            title="Reset All Bands"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-Curve Colored Graphics Response Panel (Matching Screenshot) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" /> Multi-Band Frequency Spectrum & Response Curves
          </span>
          <span className="text-[10px] text-slate-500 font-mono">20Hz – 20kHz</span>
        </div>

        <div className="w-full h-36 bg-black/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-end">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 140" preserveAspectRatio="none">
            {bands.map((b, idx) => {
              const xStart = (idx / 32) * 800;
              const yVal = 140 - ((b.gain + 24) / 48) * 120;
              return (
                <g key={b.id}>
                  <path
                    d={`M ${xStart},140 Q ${xStart + 12},${yVal} ${xStart + 25},140`}
                    fill={b.color}
                    fillOpacity="0.35"
                    stroke={b.color}
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 32 Band Boxes Grid (Hardware UI Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[58vh] overflow-y-auto pr-2">
        {bands.map((band) => {
          const freqLabel = band.freq >= 1000 ? `${(band.freq / 1000).toFixed(1)}k Hz` : `${band.freq} Hz`;

          return (
            <div 
              key={band.id} 
              className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 space-y-4 shadow-2xl relative"
              style={{ borderTopColor: band.color, borderTopWidth: '4px' }}
            >
              
              {/* Header & Color Picker Trigger */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shadow" style={{ backgroundColor: band.color }} />
                  <span className="text-xs font-mono font-bold text-white">Band {band.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveColorPickerBandId(activeColorPickerBandId === band.id ? null : band.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                    title="Change Band Color"
                  >
                    <Palette className="w-3.5 h-3.5" style={{ color: band.color }} />
                  </button>

                  {eqMode === 'peq' && (
                    <select
                      value={band.filterType}
                      onChange={(e) => handleTypeChange(band.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-[10px] rounded-lg px-2 py-1 outline-none focus:border-emerald-500"
                    >
                      <option value="peaking">Peak</option>
                      <option value="lowshelf">Low Shelf</option>
                      <option value="highshelf">High Shelf</option>
                      <option value="lowpass">LP</option>
                      <option value="highpass">HP</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Color Picker Palette Modal/Popover */}
              {activeColorPickerBandId === band.id && (
                <div className="absolute top-14 right-4 z-30 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 animate-fadeIn">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => handleColorChange(band.id, c)}
                      className="w-7 h-7 rounded-xl border border-white/20 shadow-md transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}

              {/* GAIN: Vertical Pill Fader (Matching Screenshot UI) */}
              <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex flex-col items-center space-y-3">
                <span className="text-[11px] font-semibold text-slate-400">Gain</span>

                <div className="h-32 flex items-center justify-center relative py-2">
                  {/* Vertical Level Indicator Line */}
                  <div className="absolute w-1 h-full bg-slate-800 rounded-full" />
                  <div 
                    className="absolute w-1 rounded-full bottom-0" 
                    style={{ 
                      height: `${Math.max(10, Math.min(100, ((band.gain + 24) / 48) * 100))}%`, 
                      backgroundColor: band.color 
                    }} 
                  />

                  {/* Vertical Slider Input */}
                  <input
                    type="range"
                    min="-24"
                    max="24"
                    step="0.5"
                    value={band.gain}
                    onChange={(e) => handleGainChange(band.id, Number(e.target.value))}
                    className="w-32 -rotate-90 accent-emerald-500 bg-transparent opacity-0 cursor-pointer absolute"
                  />

                  {/* Pill Thumb Handle */}
                  <div 
                    className="absolute w-8 h-5 rounded-full bg-slate-900 border-2 shadow-lg flex items-center justify-center pointer-events-none"
                    style={{ borderColor: band.color }}
                  >
                    <div className="w-3 h-0.5 bg-white rounded-full" />
                  </div>
                </div>

                {editingField?.id === band.id && editingField.field === 'gain' ? (
                  <input
                    type="number"
                    min="-24"
                    max="24"
                    step="0.5"
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onBlur={() => {
                      handleGainChange(band.id, Number(editVal) || 0);
                      setEditingField(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGainChange(band.id, Number(editVal) || 0);
                        setEditingField(null);
                      }
                    }}
                    className="w-20 bg-slate-950 text-white text-xs px-1.5 py-0.5 rounded border border-emerald-500 outline-none text-center font-mono"
                  />
                ) : (
                  <span
                    onClick={() => { setEditingField({ id: band.id, field: 'gain' }); setEditVal(band.gain.toString()); }}
                    className="text-xs font-mono font-bold cursor-pointer hover:underline"
                    style={{ color: band.color }}
                    title="Tap to type value"
                  >
                    {band.gain > 0 ? `+${band.gain}` : band.gain} dB
                  </span>
                )}
              </div>

              {/* Rotary Knobs for Frequency & Q */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Frequency Rotary Knob */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Freq</span>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-md relative cursor-pointer">
                    <div 
                      className="absolute w-1 h-3.5 rounded-full top-0.5 transform origin-bottom"
                      style={{ 
                        backgroundColor: band.color,
                        transform: `rotate(${((band.freq - 20) / 19980) * 270 - 135}deg)` 
                      }}
                    />
                    <Sliders className="w-3.5 h-3.5 opacity-60" style={{ color: band.color }} />
                  </div>

                  {editingField?.id === band.id && editingField.field === 'freq' ? (
                    <input
                      type="number"
                      min="20"
                      max="20000"
                      autoFocus
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onBlur={() => {
                        handleFreqChange(band.id, Number(editVal) || band.freq);
                        setEditingField(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFreqChange(band.id, Number(editVal) || band.freq);
                          setEditingField(null);
                        }
                      }}
                      className="w-20 bg-slate-950 text-white text-[11px] px-1 py-0.5 rounded border border-emerald-500 outline-none text-center font-mono"
                    />
                  ) : (
                    <span
                      onClick={() => { setEditingField({ id: band.id, field: 'freq' }); setEditVal(band.freq.toString()); }}
                      className="text-[11px] font-mono font-semibold cursor-pointer hover:underline text-center text-slate-200"
                      title="Tap to type frequency"
                    >
                      {freqLabel}
                    </span>
                  )}
                </div>

                {/* Q Factor Rotary Knob */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Q Factor</span>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-md relative cursor-pointer">
                    <div 
                      className="absolute w-1 h-3.5 bg-blue-400 rounded-full top-0.5 transform origin-bottom"
                      style={{ transform: `rotate(${((band.q - 0.1) / 9.9) * 270 - 135}deg)` }}
                    />
                    <Disc className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                  </div>

                  {editingField?.id === band.id && editingField.field === 'q' ? (
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      autoFocus
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onBlur={() => {
                        handleQChange(band.id, Number(editVal) || band.q);
                        setEditingField(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQChange(band.id, Number(editVal) || band.q);
                          setEditingField(null);
                        }
                      }}
                      className="w-16 bg-slate-950 text-white text-[11px] px-1 py-0.5 rounded border border-blue-500 outline-none text-center font-mono"
                    />
                  ) : (
                    <span
                      onClick={() => { setEditingField({ id: band.id, field: 'q' }); setEditVal(band.q.toString()); }}
                      className="text-[11px] text-blue-400 font-mono font-semibold cursor-pointer hover:underline text-center"
                      title="Tap to type Q factor"
                    >
                      {band.q.toFixed(1)}
                    </span>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
