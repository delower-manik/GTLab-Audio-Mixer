import React from 'react';
import { Track } from '../types';
import { Play, Music, Sparkles, Cloud, HardDrive, Trash2 } from 'lucide-react';

interface Props {
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onOpenDriveModal: () => void;
  onDeleteTrack?: (trackId: string) => void;
}

export const PlaylistManager: React.FC<Props> = ({ 
  tracks, 
  currentTrackId, 
  isPlaying, 
  onSelectTrack, 
  onOpenDriveModal,
  onDeleteTrack 
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Stem Separation Ready
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white">Poweramp Playlist & Google Drive Library</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Select any track below to instantly load its 11 AI-separated stems (Vocals, Drums, Bass, Guitars, Synths, Strings, and more) into the Track Mixer.
          </p>
        </div>

        <button
          onClick={onOpenDriveModal}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2.5 relative z-10 shrink-0"
        >
          <Cloud className="w-5 h-5" /> Connect Google Drive / Upload
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, index) => {
          const isSelected = track.id === currentTrackId;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isSelected 
                  ? 'bg-slate-900/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0">
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Play className={`w-6 h-6 text-white ${isSelected && isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{track.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{track.artist} • <span className="text-slate-500">{track.album}</span></p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      {track.aiGenre || 'AI Stem Track'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      {track.aiBpm || 120} BPM
                    </span>
                    {track.source === 'gdrive' && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-medium border border-blue-500/30 flex items-center gap-1">
                        <Cloud className="w-3 h-3" /> Drive
                      </span>
                    )}
                    {track.source === 'local' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-medium border border-amber-500/30 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Local
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
                {track.source !== 'default' && onDeleteTrack && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrack(track.id);
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
  );
};
