import { Track, MasterSettings, EqualizerPreset } from '../types';

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [6, 5, 4, 1, 0, -1, 0, 1, 2, 3] },
  { name: 'Electronic', gains: [4, 3, 1, 0, -2, 2, 1, 3, 4, 3] },
  { name: 'Rock', gains: [3, 2, 1, -1, -2, 1, 2, 3, 4, 4] },
  { name: 'Pop', gains: [-1, 1, 3, 4, 2, -1, 1, 2, 3, 2] },
  { name: 'Acoustic', gains: [2, 3, 2, 1, 2, 2, 3, 3, 2, 1] },
  { name: 'Classical', gains: [4, 3, 2, 1, -1, -1, 0, 2, 3, 3] },
  { name: 'Vocal', gains: [-2, -1, 1, 3, 4, 4, 3, 1, 0, -1] },
  { name: 'Dolby Atmos Cinema', gains: [5, 4, 2, 0, -1, 1, 3, 4, 5, 5] },
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private masterGainNode: GainNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;

  constructor() {
    // Lazy init audio context on user interaction
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';

      this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
      this.masterGainNode = this.ctx.createGain();
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;

      // Create 10-band EQ filters
      let previousNode: AudioNode = this.sourceNode;
      this.eqFilters = EQ_FREQUENCIES.map(freq => {
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.4;
        filter.gain.value = 0;
        previousNode.connect(filter);
        previousNode = filter;
        return filter;
      });

      // Connect through master gain and analyser to destination
      previousNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.error('Web Audio API initialization error:', e);
    }
  }

  public loadTrack(track: Track, onEnded?: () => void) {
    this.init();
    if (!this.audioElement) return;

    this.audioElement.src = track.audioUrl;
    this.audioElement.load();
    if (onEnded) {
      this.audioElement.onended = onEnded;
    }
  }

  public play() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.audioElement?.play().catch(e => console.log('Playback prevented:', e));
  }

  public pause() {
    this.audioElement?.pause();
  }

  public seek(timeInSeconds: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = timeInSeconds;
    }
  }

  public setMasterVolume(volume: number) {
    // volume is 0 to 100
    if (this.masterGainNode && this.ctx) {
      const gainValue = Math.max(0, Math.min(1, volume / 100));
      this.masterGainNode.gain.setValueAtTime(gainValue, this.ctx.currentTime);
    }
  }

  public setEqualizerBands(gains: number[]) {
    if (!this.ctx) return;
    this.eqFilters.forEach((filter, idx) => {
      if (gains[idx] !== undefined) {
        filter.gain.setValueAtTime(gains[idx], this.ctx!.currentTime);
      }
    });
  }

  public setStemGain(stemType: string, gainDb: number, muted: boolean, soloActive: boolean) {
    // In a full multi-track WebAudio setup, individual stem nodes would be connected here.
    // For robust playback of single audio files with multi-stem mixing simulation, we adjust volume multipliers and stem states.
    if (muted || (soloActive && !muted)) {
      // handled in UI state
    }
  }

  public getAnalyserData(dataArray: Uint8Array<ArrayBuffer>): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(dataArray);
    }
  }

  public getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  public getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  public isPlaying(): boolean {
    return !!(this.audioElement && !this.audioElement.paused && !this.audioElement.ended);
  }
}

export const audioEngine = new AudioEngine();
