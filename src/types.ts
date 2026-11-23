export interface ParametricEqBand {
  frequency: number;
  gain: number;
  q: number;
  enabled: boolean;
}

export interface FxChannel {
  inputGain: number; // dB
  effectType: 'reverb' | 'echo' | 'delay' | 'chorus' | 'flanger' | 'distortion';
  effectGain: number;
  effectEqLow: number;
  effectEqMid: number;
  effectEqHigh: number;
  outputGain: number;
  dryWetMix: number; // 0 to 100%
  bypass: boolean;
}

export interface LimiterSettings {
  threshold: number; // dB (-40 to 0)
  ratio: number; // 1 to 20
  attack: number; // ms (0.1 to 100)
  release: number; // ms (10 to 1000)
  makeupGain: number; // dB (0 to 24)
  noiseGateThreshold: number; // dB (-80 to -20)
  enabled: boolean;
}

export interface AudioStem {
  id: string;
  name: string;
  type: 
    | 'vocal_noises' 
    | 'drums' 
    | 'bass' 
    | 'guitar' 
    | 'acoustic_guitar' 
    | 'electric_guitar' 
    | 'keyboard' 
    | 'synthesizer' 
    | 'flute' 
    | 'strings' 
    | 'wind';
  label: string;
  gain: number; // dB (-24 to +12)
  pan: number; // -100 to 100
  muted: boolean;
  solo: boolean;
  eqBands: ParametricEqBand[];
  fxChannel1: FxChannel;
  fxChannel2: FxChannel;
  limiter: LimiterSettings;
  color: string;
  volumeLevel?: number; // Realtime VU meter value 0-100
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl: string;
  source: 'local' | 'gdrive' | 'default';
  gdriveId?: string;
  stems: AudioStem[];
  aiAnalyzed: boolean;
  aiGenre?: string;
  aiMood?: string;
  aiBpm?: number;
  aiKey?: string;
  aiInsights?: string;
}

export interface DolbyAtmosSettings {
  spatialWidth: number; // 0 to 100
  heightVirtualizer: number; // 0 to 100
  bassEnhancer: number; // 0 to 100
  dialogClarity: number; // 0 to 100
  surroundMode: 'cinema' | 'music' | 'live' | 'gaming' | 'off';
  enabled: boolean;
}

export interface MasterSettings {
  volume: number; // 0 to 100
  pan: number;
  limiter: LimiterSettings;
  dolbyAtmos: DolbyAtmosSettings;
}

export interface EqualizerPreset {
  name: string;
  gains: number[]; // 10 bands
}
