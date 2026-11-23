import React from 'react';
import { Sparkles, Disc } from 'lucide-react';
import { MasterSettings, DolbyAtmosSettings } from '../types';

interface Props {
  masterSettings: MasterSettings;
  onUpdateMaster: (settings: MasterSettings) => void;
}

export const DolbyAtmosPanel: React.FC<Props> = ({ masterSettings, onUpdateMaster }) => {
  const atmos = masterSettings.dolbyAtmos;

  const handleAtmosChange = (field: keyof DolbyAtmosSettings, value: any) => {
    const updated = { ...atmos, [field]: value };
    onUpdateMaster({ ...masterSettings, dolbyAtmos: updated });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Dolby Atmos 3D Spatial Audio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Immersive Spatial Audio Engine</h2>
          <p className="text-xs text-slate-400">Configure spatial width, height virtualizer, bass enhancement, and surround acoustic modes.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAtmosChange('enabled', !atmos.enabled)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              atmos.enabled ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Disc className={`w-4 h-4 ${atmos.enabled ? 'animate-spin' : ''}`} />
            Dolby Atmos {atmos.enabled ? 'Active' : 'Bypassed'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <div className={`bg-slate-950/70 border rounded-2xl p-6 shadow-2xl space-y-6 transition-all ${!atmos.enabled ? 'opacity-50 pointer-events-none border-slate-800' : 'border-blue-500/40 bg-blue-950/10'}`}>
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Spatial Surround & Height Virtualizer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Surround Preset:</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Spatial Width</span>
              <span className="text-blue-400 font-mono font-bold">{atmos.spatialWidth}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.spatialWidth}
              onChange={(e) => handleAtmosChange('spatialWidth', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Height Virtualizer</span>
              <span className="text-blue-400 font-mono font-bold">{atmos.heightVirtualizer}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.heightVirtualizer}
              onChange={(e) => handleAtmosChange('heightVirtualizer', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Bass Enhancer</span>
              <span className="text-blue-400 font-mono font-bold">{atmos.bassEnhancer}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="1"
              value={atmos.bassEnhancer}
              onChange={(e) => handleAtmosChange('bassEnhancer', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">Dialog Clarity</span>
              <span className="text-blue-400 font-mono font-bold">{atmos.dialogClarity}%</span>
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
