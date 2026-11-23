import React, { useEffect, useState } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Sparkles, Sliders, Repeat, Shuffle } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface Props {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  masterVolume: number;
  onVolumeChange: (vol: number) => void;
}

export const PlayerBar: React.FC<Props> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  masterVolume,
  onVolumeChange
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.duration || 180);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(audioEngine.getCurrentTime());
        const d = audioEngine.getDuration();
        if (d && !isNaN(d)) setDuration(d);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    audioEngine.seek(val);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = Math.floor(secs % 60);
    return `${mins}:${String(remainSecs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 lg:px-8 py-3.5 z-40 flex flex-col gap-2 shadow-2xl">
      
      {/* Seek bar */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-emerald-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-400 w-10">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        
        {/* Track Info */}
        <div className="flex items-center gap-3.5 w-1/3">
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover shadow-md border border-slate-800" />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
            <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
          </div>
          <span className="hidden lg:inline-flex px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-full items-center gap-1">
            <Sparkles className="w-3 h-3" /> 11 Stems
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-lg transition-colors ${isShuffle ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onPrev}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-md"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-lg transition-colors ${isRepeat ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Status */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={masterVolume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 lg:w-32 accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-8">{masterVolume}%</span>
        </div>

      </div>

    </div>
  );
};
