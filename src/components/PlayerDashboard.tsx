import React, { useRef } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, FastForward, Rewind, Plus, Music, HardDrive, Trash2, Sparkles, Activity } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface Props {
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onAddTracks: (newTracks: Track[]) => void;
  onDeleteTrack: (trackId: string) => void;
}

export const PlayerDashboard: React.FC<Props> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onNext,
  onPrev,
  onAddTracks,
  onDeleteTrack
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 50); // Up to 50 files
    const newTracks: Track[] = fileList.map((file, idx) => ({
      id: `uploaded-${Date.now()}-${idx}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Local Device / Phone Audio',
      album: 'Imported Library',
      duration: 200,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      audioUrl: URL.createObjectURL(file),
      source: 'local',
      stems: [
        { id: 's-1', name: 'Vocal & Noises', type: 'vocal_noises', label: 'Lead Vocals', gain: 0, pan: 0, muted: false, solo: false, color: '#ec4899', eqBands: [], fxChannel1: { inputGain: 0, effectType: 'reverb', effectGain: 30, effectEqLow: 0, effectEqMid: 0, effectEqHigh: 0, outputGain: 0, dryWetMix: 20, bypass: false }, fxChannel2: { inputGain: 0, effectType: 'delay', effectGain: 0, effectEqLow: 0, effectEqMid: 0, effectEqHigh: 0, outputGain: 0, dryWetMix: 0, bypass: true }, limiter: { threshold: -10, ratio: 3, attack: 5, release: 100, makeupGain: 2, noiseGateThreshold: -50, enabled: true } },
        { id: 's-2', name: 'Drums', type: 'drums', label: 'Perks & Kick', gain: 2, pan: 0, muted: false, solo: false, color: '#3b82f6', eqBands: [], fxChannel1: { inputGain: 0, effectType: 'reverb', effectGain: 20, effectEqLow: 0, effectEqMid: 0, effectEqHigh: 0, outputGain: 0, dryWetMix: 15, bypass: false }, fxChannel2: { inputGain: 0, effectType: 'chorus', effectGain: 0, effectEqLow: 0, effectEqMid: 0, effectEqHigh: 0, outputGain: 0, dryWetMix: 0, bypass: true }, limiter: { threshold: -8, ratio: 4, attack: 2, release: 50, makeupGain: 3, noiseGateThreshold: -60, enabled: true } }
      ],
      aiAnalyzed: true,
      aiGenre: file.name.endsWith('.flac') ? 'Lossless FLAC' : file.name.endsWith('.wav') ? 'Studio WAV' : 'Audio File',
      aiMood: 'Custom Upload',
      aiBpm: 120,
      aiKey: 'A minor'
    })) as Track[];

    onAddTracks(newTracks);
  };

  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  const handleFastRewind = () => {
    const cur = audioEngine.getCurrentTime();
    audioEngine.seek(Math.max(0, cur - 10));
  };

  const handleFastForward = () => {
    const cur = audioEngine.getCurrentTime();
    const dur = audioEngine.getDuration() || 180;
    audioEngine.seek(Math.min(dur, cur + 10));
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const dur = audioEngine.getDuration() || 180;
    audioEngine.seek(ratio * dur);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-32 animate-fadeIn">
      
      {/* Top Header & Add ➕ Button */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> Poweramp Music Player
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Audio Library & Player UI</h2>
          <p className="text-xs text-slate-400">Upload up to 50 audio files simultaneously (MP3, MP4, WAV, WMA, FLAC, AAC) and stream instantly.</p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="audio/*,.mp3,.mp4,.wav,.wma,.flac,.aac,.m4a"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add ➕ Audio Files (Max 50)
          </button>
        </div>
      </div>

      {/* Overlay Minimal Floating Waveform Panel */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" /> Now Playing Waveform (Tap to Seek): {currentTrack.title}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{currentTrack.artist}</span>
        </div>

        {/* Interactive Floating Waveform Bar */}
        <div 
          onClick={handleWaveformClick}
          className="w-full h-16 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between px-2 cursor-pointer relative overflow-hidden group hover:border-emerald-500/60 transition-colors"
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const heightPct = Math.sin(i * 0.4) * 40 + 50;
            return (
              <div
                key={i}
                className="w-1.5 bg-emerald-500/60 group-hover:bg-emerald-400 rounded-full transition-all"
                style={{ height: `${heightPct}%` }}
              />
            );
          })}
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      {/* Player Controls: ⏮️ ⏪ ⏯️ ⏩ ⏭️ */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center space-y-4">
        <div className="flex items-center gap-6">
          <button
            onClick={onPrev}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
            title="Previous Track (⏮️)"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleFastRewind}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
            title="Rewind 10s (⏪)"
          >
            <Rewind className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-5 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 transition-all transform hover:scale-105"
            title="Play / Pause (⏯️)"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleFastForward}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
            title="Forward 10s (⏩)"
          >
            <FastForward className="w-5 h-5" />
          </button>

          <button
            onClick={onNext}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
            title="Next Track (⏭️)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Uploaded Files Playlist List with Duration */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" /> Loaded Audio Files ({tracks.length}/50)
          </h3>
          <span className="text-xs text-slate-400">Supported: MP3, MP4, WAV, WMA, FLAC, AAC</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto pr-2">
          {tracks.map((track, index) => {
            const isSelected = track.id === currentTrackId;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-emerald-500/80 shadow-md shadow-emerald-500/10' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono text-slate-500 w-6">#{index + 1}</span>
                  <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover shadow" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{track.title}</h4>
                    <p className="text-xs text-slate-400">{track.artist} • <span className="text-emerald-400">{track.aiGenre || 'Audio'}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-400">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </span>
                  {track.source !== 'default' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrack(track.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
