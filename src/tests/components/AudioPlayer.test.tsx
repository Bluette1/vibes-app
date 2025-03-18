// src/tests/components/AudioPlayer.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import { AudioProvider } from '../../contexts/AudioContext';
import { useAudioPlayer } from '../../hooks/useAudioPlayer/useAudioPlayer';
import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';

// Mock the useAudioPlayer hook
vi.mock('../../hooks/useAudioPlayer/useAudioPlayer');
const mockUseAudioPlayer = useAudioPlayer as Mock;

// Mock track data
const mockTracks = [
  { id: '1', name: 'Track 1', src: 'track1.mp3' },
  { id: '2', name: 'Track 2', src: 'track2.mp3' },
];

describe('AudioPlayer', () => {
  beforeEach(() => {
    mockUseAudioPlayer.mockReturnValue({
      isPlaying: false,
      isMuted: false,
      isLoop: false,
      volume: 0.5,
      play: vi.fn(),
      pause: vi.fn(),
      toggleMute: vi.fn(),
      toggleLoop: vi.fn(),
      setVolume: vi.fn(),
    });
  });

  const renderWithProvider = (selectedTrackId = '1') => {
    render(
      <AudioProvider initialTracks={mockTracks} initialSelectedTrackId={selectedTrackId}>
        <AudioPlayer />
      </AudioProvider>
    );
  };

  it('renders the audio player', () => {
    renderWithProvider();

    expect(screen.getByTestId('audio-player')).toBeTruthy();
    expect(screen.getByLabelText(/play/i)).toBeTruthy();
    expect(screen.getByLabelText(/mute/i)).toBeTruthy();
  });

  it.skip('plays and pauses the track', () => {
    mockUseAudioPlayer.mockReturnValueOnce({
      isPlaying: true, // Simulate that the track is playing
      isMuted: false,
      isLoop: false,
      volume: 0.5,
      play: vi.fn(),
      pause: vi.fn(),
      toggleMute: vi.fn(),
      toggleLoop: vi.fn(),
      setVolume: vi.fn(),
    });

    renderWithProvider();

    const pauseButton = screen.getByLabelText(/pause/i);
    fireEvent.click(pauseButton);
    expect(mockUseAudioPlayer().pause).toHaveBeenCalled();

    // Switch to play state
    mockUseAudioPlayer.mockReturnValueOnce({
      isPlaying: false,
      isMuted: false,
      isLoop: false,
      volume: 0.5,
      play: vi.fn(),
      pause: vi.fn(),
      toggleMute: vi.fn(),
      toggleLoop: vi.fn(),
      setVolume: vi.fn(),
    });

    const playButton = screen.getByLabelText(/play/i);
    fireEvent.click(playButton);
    expect(mockUseAudioPlayer().play).toHaveBeenCalled();
  });

  it.skip('toggles mute and unmute', () => {
    mockUseAudioPlayer.mockReturnValueOnce({
      isPlaying: false,
      isMuted: true, // Initially muted
      isLoop: false,
      volume: 0.5,
      play: vi.fn(),
      pause: vi.fn(),
      toggleMute: vi.fn(),
      toggleLoop: vi.fn(),
      setVolume: vi.fn(),
    });

    renderWithProvider();

    const unmuteButton = screen.getByLabelText(/unmute/i);
    fireEvent.click(unmuteButton);
    expect(mockUseAudioPlayer().toggleMute).toHaveBeenCalled();
  });

  it.skip('toggles loop and unloop', () => {
    mockUseAudioPlayer.mockReturnValueOnce({
      isPlaying: false,
      isMuted: false,
      isLoop: true, // Initially looping
      volume: 0.5,
      play: vi.fn(),
      pause: vi.fn(),
      toggleMute: vi.fn(),
      toggleLoop: vi.fn(),
      setVolume: vi.fn(),
    });

    renderWithProvider();

    const unloopButton = screen.getByLabelText(/unloop/i);
    fireEvent.click(unloopButton);
    expect(mockUseAudioPlayer().toggleLoop).toHaveBeenCalled();
  });

  it('changes volume', () => {
    renderWithProvider();

    const volumeSlider = screen.getByLabelText(/volume/i);
    fireEvent.change(volumeSlider, { target: { value: '0.8' } });
    expect(mockUseAudioPlayer().setVolume).toHaveBeenCalledWith(0.8);
  });
});
