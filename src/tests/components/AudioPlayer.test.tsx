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

// Mock the Icon components to simplify testing
vi.mock('../../components/Icons/PlayIcon', () => ({
  default: () => <div data-testid="play-icon">Play Icon</div>,
}));

vi.mock('../../components/Icons/PauseIcon', () => ({
  default: () => <div data-testid="pause-icon">Pause Icon</div>,
}));

vi.mock('../../components/Icons/LoopIcon', () => ({
  default: () => <div data-testid="loop-icon">Loop Icon</div>,
}));

vi.mock('../../components/Icons/UnLoopIcon', () => ({
  default: () => <div data-testid="unloop-icon">Unloop Icon</div>,
}));

vi.mock('../../components/Icons/VolumeOnIcon', () => ({
  default: () => <div data-testid="volume-on-icon">Volume On Icon</div>,
}));

vi.mock('../../components/Icons/MutedIcon', () => ({
  default: () => <div data-testid="muted-icon">Muted Icon</div>,
}));

// Mock console.log to avoid noise during tests
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

// Mock track data
const mockTracks = [
  { id: '1', name: 'Track 1', src: 'track1.mp3' },
  { id: '2', name: 'Track 2', src: 'track2.mp3' },
];

describe('AudioPlayer', () => {
  const mockPlay = vi.fn();
  const mockPause = vi.fn();
  const mockToggleMute = vi.fn();
  const mockToggleLoop = vi.fn();
  const mockSetVolume = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockUseAudioPlayer.mockReturnValue({
      isPlaying: false,
      isMuted: false,
      isLoop: false,
      volume: 0.5,
      play: mockPlay,
      pause: mockPause,
      toggleMute: mockToggleMute,
      toggleLoop: mockToggleLoop,
      setVolume: mockSetVolume,
    });
  });

  const renderWithProvider = (selectedTrackId = '1') => {
    return render(
      <AudioProvider initialTracks={mockTracks} initialSelectedTrackId={selectedTrackId}>
        <AudioPlayer />
      </AudioProvider>
    );
  };

  it('renders the audio player with correct initial state', () => {
    renderWithProvider();

    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByTestId('loop-icon')).toBeInTheDocument();
    expect(screen.getByTestId('volume-on-icon')).toBeInTheDocument();

    // Verify volume slider is set to initial value
    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    expect(volumeSlider).toHaveValue('0.5');
  });

  it('calls play function when play button is clicked', () => {
    renderWithProvider();

    const playButton = screen.getByLabelText(/play/i);
    fireEvent.click(playButton);

    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  it('calls pause function when pause button is clicked', () => {
    // Set isPlaying to true to show pause button
    mockUseAudioPlayer.mockReturnValue({
      isPlaying: true,
      isMuted: false,
      isLoop: false,
      volume: 0.5,
      play: mockPlay,
      pause: mockPause,
      toggleMute: mockToggleMute,
      toggleLoop: mockToggleLoop,
      setVolume: mockSetVolume,
    });

    renderWithProvider();

    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();

    const pauseButton = screen.getByLabelText(/pause/i);
    fireEvent.click(pauseButton);

    expect(mockPause).toHaveBeenCalledTimes(1);
  });

  it('calls toggleMute function when mute button is clicked', () => {
    renderWithProvider();

    const muteButton = screen.getByLabelText(/mute/i);
    fireEvent.click(muteButton);

    expect(mockToggleMute).toHaveBeenCalledTimes(1);
  });

  it('calls toggleMute function when unmute button is clicked', () => {
    // Set isMuted to true to show unmute button
    mockUseAudioPlayer.mockReturnValue({
      isPlaying: false,
      isMuted: true,
      isLoop: false,
      volume: 0.5,
      play: mockPlay,
      pause: mockPause,
      toggleMute: mockToggleMute,
      toggleLoop: mockToggleLoop,
      setVolume: mockSetVolume,
    });

    renderWithProvider();

    expect(screen.getByTestId('muted-icon')).toBeInTheDocument();

    const unmuteButton = screen.getByLabelText(/unmute/i);
    fireEvent.click(unmuteButton);

    expect(mockToggleMute).toHaveBeenCalledTimes(1);
  });

  it('calls toggleLoop function when loop button is clicked', () => {
    renderWithProvider();

    const loopButton = screen.getByLabelText(/loop/i);
    fireEvent.click(loopButton);

    expect(mockToggleLoop).toHaveBeenCalledTimes(1);
  });

  it('calls toggleLoop function when unloop button is clicked', () => {
    // Set isLoop to true to show unloop button
    mockUseAudioPlayer.mockReturnValue({
      isPlaying: false,
      isMuted: false,
      isLoop: true,
      volume: 0.5,
      play: mockPlay,
      pause: mockPause,
      toggleMute: mockToggleMute,
      toggleLoop: mockToggleLoop,
      setVolume: mockSetVolume,
    });

    renderWithProvider();

    expect(screen.getByTestId('unloop-icon')).toBeInTheDocument();

    const unloopButton = screen.getByLabelText(/unloop/i);
    fireEvent.click(unloopButton);

    expect(mockToggleLoop).toHaveBeenCalledTimes(1);
  });

  it('calls setVolume with correct value when volume slider is changed', () => {
    renderWithProvider();

    const volumeSlider = screen.getByLabelText(/volume/i);
    fireEvent.change(volumeSlider, { target: { value: '0.8' } });

    expect(mockSetVolume).toHaveBeenCalledWith(0.8);
  });

  it('uses the selected track from the context', () => {
    renderWithProvider('2'); // Render with track 2 selected

    // Verify the useAudioPlayer was called with the correct track source
    expect(mockUseAudioPlayer).toHaveBeenCalledWith('track2.mp3');
  });

  it('falls back to the first track if selected track is not found', () => {
    renderWithProvider('non-existent-id');

    // Should fall back to the first track
    expect(mockUseAudioPlayer).toHaveBeenCalledWith('track1.mp3');
  });
});
