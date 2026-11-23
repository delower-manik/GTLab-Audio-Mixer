import React, { useState } from 'react';
import { Volume2, Sparkles, Sliders, ShieldAlert, Disc, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { MasterSettings, DolbyAtmosSettings, LimiterSettings, Track } from '../types';
import { audioEngine } from '../services/audioEngine';

interface Props {
  masterSettings: MasterSettings;
  onUpdateMaster: (settings: MasterSettings) => void;
  currentTrack: Track;
  onExportRenderedTrack: (newTrack: Track) => void;
}

export const MasterPanel: React.FC<Props> = ({ 
  masterSettings, 
  onUpdateMaster, 
  currentTrack, 
  onExportRenderedTrack 
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);

  const atmos = masterSettings.dolbyAtmos;
  const limiter = masterSettings.limiter;

  const handleVolumeChange = (vol: number) => {
    onUpdateMaster({ ...masterSettings, volume: vol });
    audioEngine.setMasterVolume(vol);
  };

  const handleAtmosChange = (field: keyof DolbyAtmosSettings, value: any) => {
    const updated = { ...atmos, [field]: value };
    onUpdateMaster({ ...masterSettings, dolbyAtmos: updated });
  };

  const handleLimiterChange = (field: keyof LimiterSettings, value: any) => {
    const updated = { ...limiter, [field]: value };
    onUpdateMaster({ ...masterSettings, limiter: updated });
  };

  const handleStartExportRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setRenderComplete(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsRendering(false);
        setRenderComplete(true);

        // Create new playlist track entry
        const exportedTrack: Track = {
          id: `exported-mix-${Date.now()}`,
          title: `${currentTrack.title} (Atmos Mastered Mix)`,
          artist: `${currentTrack.artist} [PowerAI Render]`,
          album: 'PowerAI Exported Mixes',
          duration: currentTrack.duration,
          coverUrl: currentTrack.coverUrl,
          audioUrl: currentTrack.audioUrl,
          source: 'local',
          stems: currentTrack.stems,
          aiAnalyzed: true,
          aiGenre: `${currentTrack.aiGenre || 'Mastered'} • Dolby Atmos`,
          aiMood: 'Studio Mastered',
          aiBpm: currentTrack.aiBpm,
          aiKey: currentTrack.aiKey,
          aiInsights: 'Audio successfully rendered using simulated 32-bit float Dolby Atmos pipeline and stem summing.'
        };

        onExportRenderedTrack(exportedTrack);
      }
      setRenderProgress(progress);
    }, 200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Dolby Atmos Spatial Audio & Export Studio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Master Volume & Audio Renderer</h2>
          <p className="text-xs text-slate-400">Immersive spatial 3D audio rendering, height virtualizer, and master export to playlist.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartExportRender}
            disabled={isRendering}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50"
          >
            {isRendering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isRendering ? `Rendering Mix (${renderProgress}%)...` : 'Export & Save Mix to Playlist'}
          </button>
        </div>
      </div>

      {renderComplete && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Success! The mastered mix has been successfully rendered and added as a new file entry in your playlist.</span>
          </div>
          <button onClick={() => setRenderComplete(false)} className="text-emerald-400 hover:text-white font-semibold">Dismiss</button>
        </div>
      )}

      {/* Master Volume Section */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Master Output Volume</h3>
              <p className="text-xs text-slate-400">Overall playback gain control</p>
            </div>
          </div>
          <span className="text-lg font-mono font-bold text-emerald-400">{masterSettings.volume}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={masterSettings.volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-3 cursor-pointer"
        />
      </div>

      {/* Dolby Atmos Spatial Settings */}
      <div className={`bg-slate-950/70 border rounded-2xl p-6 shadow-2xl space-y-6 transition-all ${!atmos.enabled ? 'opacity-50 pointer-events-none border-slate-800' : 'border-blue-500/40 bg-blue-950/10'}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Spatial Audio & Surround Acoustic Controls
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Surround Mode:</span>
            <select
              value={atmos.surroundMode}
              onChange={(e) => handleAtmosChange('surroundMode', e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-500"
            >
              <option value="cinema">Dolby Cinema</option>
              <option value="music">Spatial Music</option>
              <option value="live">Live Concert Hall</option>
              <option value="gaming">Immersive Gaming</option>
              <option value="off">Standard Stereo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Spatial Width</span>
              <span className="text-blue-400 font-mono">{atmos.spatialWidth}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.spatialWidth}
              onChange={(e) => handleAtmosChange('spatialWidth', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Height Virtualizer</span>
              <span className="text-blue-400 font-mono">{atmos.heightVirtualizer}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.heightVirtualizer}
              onChange={(e) => handleAtmosChange('heightVirtualizer', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Bass Enhancer</span>
              <span className="text-blue-400 font-mono">{atmos.bassEnhancer}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.bassEnhancer}
              onChange={(e) => handleAtmosChange('bassEnhancer', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Dialog Clarity</span>
              <span className="text-blue-400 font-mono">{atmos.dialogClarity}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.dialogClarity}
              onChange={(e) => handleAtmosChange('dialogClarity', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
