import React, { useState } from 'react';
import { Track, AudioStem, ParametricEqBand, FxChannel, LimiterSettings } from '../types';
import { Sliders, Wand2, ShieldAlert, Volume2, VolumeX, Mic, Disc, Radio, Guitar, Piano, Wind, Music, Sparkles, RefreshCw } from 'lucide-react';
import { ParametricEqModal } from './ParametricEqModal';
import { FxChainModal } from './FxChainModal';
import { LimiterModal } from './LimiterModal';
import { analyzeTrackWithGemini } from '../services/geminiService';

import { SpectrumVisualizer } from './SpectrumVisualizer';

interface Props {
  track: Track;
  onUpdateTrack: (updatedTrack: Track) => void;
}

export const TrackMixer: React.FC<Props> = ({ track, onUpdateTrack }) => {
  const [selectedStemForEq, setSelectedStemForEq] = useState<AudioStem | null>(null);
  const [selectedStemForFx, setSelectedStemForFx] = useState<AudioStem | null>(null);
  const [selectedStemForLimiter, setSelectedStemForLimiter] = useState<AudioStem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(track.aiInsights || null);

  const handleGainChange = (stemId: string, gain: number) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, gain } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
  };

  const handleMuteToggle = (stemId: string) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, muted: !s.muted } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
  };

  const handleSoloToggle = (stemId: string) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, solo: !s.solo } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
  };

  const handleUpdateEq = (stemId: string, bands: ParametricEqBand[]) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, eqBands: bands } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
    if (selectedStemForEq) {
      setSelectedStemForEq({ ...selectedStemForEq, eqBands: bands });
    }
  };

  const handleUpdateFx = (stemId: string, fx1: FxChannel, fx2: FxChannel) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, fxChannel1: fx1, fxChannel2: fx2 } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
    if (selectedStemForFx) {
      setSelectedStemForFx({ ...selectedStemForFx, fxChannel1: fx1, fxChannel2: fx2 });
    }
  };

  const handleUpdateLimiter = (stemId: string, limiter: LimiterSettings) => {
    const updatedStems = track.stems.map(s => s.id === stemId ? { ...s, limiter } : s);
    onUpdateTrack({ ...track, stems: updatedStems });
    if (selectedStemForLimiter) {
      setSelectedStemForLimiter({ ...selectedStemForLimiter, limiter });
    }
  };

  const handleRunAiMastering = async () => {
    setIsAnalyzing(true);
    const result = await analyzeTrackWithGemini(track);
    setIsAnalyzing(false);
    setAiMessage(result.aiInsights);

    // Apply suggested stem gains
    const updatedStems = track.stems.map(stem => {
      const match = result.suggestedStemGains.find(s => s.stemName.toLowerCase() === stem.name.toLowerCase());
      if (match) {
        return { ...stem, gain: match.suggestedGain };
      }
      return stem;
    });

    onUpdateTrack({
      ...track,
      aiAnalyzed: true,
      aiGenre: result.genre,
      aiMood: result.mood,
      aiBpm: result.bpm,
      aiKey: result.key,
      aiInsights: result.aiInsights,
      stems: updatedStems
    });
  };

  const getStemIcon = (type: string) => {
    switch (type) {
      case 'vocal_noises': return <Mic className="w-5 h-5" />;
      case 'drums': return <Disc className="w-5 h-5" />;
      case 'bass': return <Radio className="w-5 h-5" />;
      case 'guitar': 
      case 'acoustic_guitar':
      case 'electric_guitar': return <Guitar className="w-5 h-5" />;
      case 'keyboard':
      case 'synthesizer': return <Piano className="w-5 h-5" />;
      case 'flute':
      case 'wind': return <Wind className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28">
      
      {/* Real-time D3 Spectrum Visualizer at the top of the dashboard */}
      <SpectrumVisualizer isPlaying={true} />

      {/* Top Banner & AI Inspector */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img src={track.coverUrl} alt={track.title} className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-slate-700" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Stem Separator Active
              </span>
              <span className="text-xs font-mono text-slate-400">{track.aiBpm || 120} BPM • {track.aiKey || 'A Minor'}</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white">{track.title}</h2>
            <p className="text-xs text-slate-400">{track.artist} • <span className="text-emerald-400">{track.aiGenre || 'AI Multi-Track'}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAiMastering}
            disabled={isAnalyzing}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing Stems with Gemini AI...' : 'Run AI Stem Auto-Master'}
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-200 block mb-0.5">Gemini AI Studio Mixing Critique:</strong>
            {aiMessage}
          </div>
        </div>
      )}

      {/* 11 Dynamic Stem Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {track.stems.map((stem) => {
          const isMuted = stem.muted;
          const isSolo = stem.solo;

          return (
            <div 
              key={stem.id}
              className={`bg-slate-950/70 border rounded-2xl p-5 backdrop-blur-md shadow-xl transition-all space-y-4 ${
                isMuted ? 'opacity-50 border-red-500/30' : isSolo ? 'border-amber-500/80 shadow-amber-500/10' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Stem Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: stem.color }}>
                    {getStemIcon(stem.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{stem.name}</h4>
                    <p className="text-[11px] text-slate-400">{stem.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMuteToggle(stem.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isMuted ? 'bg-red-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => handleSoloToggle(stem.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSolo ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>

              {/* Gain Fader & VU Meter */}
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Gain / Volume</span>
                  <span className="text-emerald-400 font-mono font-bold">{stem.gain > 0 ? `+${stem.gain}` : stem.gain} dB</span>
                </div>
                <input
                  type="range"
                  min="-24"
                  max="12"
                  step="0.5"
                  value={stem.gain}
                  onChange={(e) => handleGainChange(stem.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />

                {/* Animated VU Meter simulation */}
                <div className="flex items-center gap-1 pt-1">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-150"
                      style={{ width: isMuted ? '0%' : `${Math.max(10, Math.min(100, (stem.gain + 24) * 2.7))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">VU</span>
                </div>
              </div>

              {/* EQ, FX, Limiter Sub-Menu Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedStemForEq(stem)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" /> EQ
                </button>

                <button
                  onClick={() => setSelectedStemForFx(stem)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5 text-blue-400" /> FX
                </button>

                <button
                  onClick={() => setSelectedStemForLimiter(stem)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Limit
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedStemForEq && (
        <ParametricEqModal
          stem={selectedStemForEq}
          isOpen={!!selectedStemForEq}
          onClose={() => setSelectedStemForEq(null)}
          onUpdate={(bands) => handleUpdateEq(selectedStemForEq.id, bands)}
        />
      )}

      {selectedStemForFx && (
        <FxChainModal
          stem={selectedStemForFx}
          isOpen={!!selectedStemForFx}
          onClose={() => setSelectedStemForFx(null)}
          onUpdate={(fx1, fx2) => handleUpdateFx(selectedStemForFx.id, fx1, fx2)}
        />
      )}

      {selectedStemForLimiter && (
        <LimiterModal
          stem={selectedStemForLimiter}
          isOpen={!!selectedStemForLimiter}
          onClose={() => setSelectedStemForLimiter(null)}
          onUpdate={(limiter) => handleUpdateLimiter(selectedStemForLimiter.id, limiter)}
        />
      )}

    </div>
  );
};
