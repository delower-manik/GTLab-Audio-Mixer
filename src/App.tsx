import React, { useState, useEffect } from 'react';
import { Track, MasterSettings } from './types';
import { defaultTracks } from './data/defaultTracks';
import { audioEngine } from './services/audioEngine';
import { Navbar } from './components/Navbar';
import { PlayerDashboard } from './components/PlayerDashboard';
import { PlaylistManager } from './components/PlaylistManager';
import { TrackMixer } from './components/TrackMixer';
import { LimiterGatePanel } from './components/LimiterGatePanel';
import { DolbyAtmosPanel } from './components/DolbyAtmosPanel';
import { MasterMixPanel } from './components/MasterMixPanel';
import { EqStudio } from './components/EqStudio';
import { PlayerBar } from './components/PlayerBar';
import { GoogleDriveModal } from './components/GoogleDriveModal';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(defaultTracks);
  const [currentTrackId, setCurrentTrackId] = useState<string>(defaultTracks[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'player' | 'playlist' | 'mixer' | 'limiter' | 'atmos' | 'mastermix' | 'eq32'>('player');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

  const [masterSettings, setMasterSettings] = useState<MasterSettings>({
    volume: 80,
    pan: 0,
    limiter: {
      threshold: -2,
      ratio: 10,
      attack: 1,
      release: 50,
      makeupGain: 1,
      noiseGateThreshold: -60,
      enabled: true
    },
    dolbyAtmos: {
      spatialWidth: 85,
      heightVirtualizer: 70,
      bassEnhancer: 65,
      dialogClarity: 75,
      surroundMode: 'music',
      enabled: true
    }
  });

  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  useEffect(() => {
    audioEngine.loadTrack(currentTrack, () => {
      handleNextTrack();
    });
    audioEngine.setMasterVolume(masterSettings.volume);
  }, [currentTrackId]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrackId(track.id);
    audioEngine.loadTrack(track, () => {
      handleNextTrack();
    });
    audioEngine.play();
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleSelectTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleSelectTrack(tracks[prevIndex]);
  };

  const handleUpdateTrack = (updatedTrack: Track) => {
    setTracks(tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t));
  };

  const handleAddTrack = (newTrack: Track) => {
    setTracks([newTrack, ...tracks]);
    handleSelectTrack(newTrack);
  };

  const handleAddMultipleTracks = (newTracks: Track[]) => {
    setTracks([...newTracks, ...tracks]);
    if (newTracks.length > 0) {
      handleSelectTrack(newTracks[0]);
    }
  };

  const handleDeleteTrack = (trackId: string) => {
    const filtered = tracks.filter(t => t.id !== trackId);
    setTracks(filtered);
    if (currentTrackId === trackId && filtered.length > 0) {
      handleSelectTrack(filtered[0]);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setMasterSettings({ ...masterSettings, volume: vol });
    audioEngine.setMasterVolume(vol);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        playlistCount={tracks.length}
      />

      {/* Main Container */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'player' && (
          <PlayerDashboard
            tracks={tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onTogglePlay={handleTogglePlay}
            onNext={handleNextTrack}
            onPrev={handlePrevTrack}
            onAddTracks={handleAddMultipleTracks}
            onDeleteTrack={handleDeleteTrack}
          />
        )}

        {activeTab === 'playlist' && (
          <PlaylistManager
            tracks={tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onOpenDriveModal={() => setIsDriveModalOpen(true)}
            onDeleteTrack={handleDeleteTrack}
          />
        )}

        {activeTab === 'mixer' && (
          <TrackMixer
            track={currentTrack}
            onUpdateTrack={handleUpdateTrack}
          />
        )}

        {activeTab === 'limiter' && (
          <LimiterGatePanel
            currentTrack={currentTrack}
            onUpdateTrack={handleUpdateTrack}
          />
        )}

        {activeTab === 'atmos' && (
          <DolbyAtmosPanel
            masterSettings={masterSettings}
            onUpdateMaster={setMasterSettings}
          />
        )}

        {activeTab === 'mastermix' && (
          <MasterMixPanel
            masterSettings={masterSettings}
            onUpdateMaster={setMasterSettings}
            currentTrack={currentTrack}
            onExportRenderedTrack={handleAddTrack}
            onUpdateTrackStems={handleUpdateTrack}
          />
        )}

        {activeTab === 'eq32' && (
          <EqStudio />
        )}
      </main>

      {/* Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        masterVolume={masterSettings.volume}
        onVolumeChange={handleVolumeChange}
      />

      {/* Google Drive / Upload Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onAddTrack={handleAddTrack}
      />

    </div>
  );
}
