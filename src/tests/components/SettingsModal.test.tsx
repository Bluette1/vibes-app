import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { useAudio } from '../../contexts/AudioContext';

// Mock the AudioContext
vi.mock('../../contexts/AudioContext', () => ({
  useAudio: vi.fn(),
}));

describe('SettingsModal', () => {
  const mockProps = {
    transitionInterval: 10000,
    handleIntervalChange: vi.fn(),
    onClose: vi.fn(),
    isSaving: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    vi.mocked(useAudio).mockReturnValue({
      tracks: [
        { id: '1', name: 'Track 1' },
        { id: '2', name: 'Track 2' },
        { id: '3', name: 'Track 3' },
      ],
      selectedTrackId: '1',
      selectTrack: vi.fn(),
      isTrackSaving: false,
    });
  });

  it('renders correctly with default props', () => {
    render(<SettingsModal {...mockProps} />);

    // Check if headings are displayed
    expect(screen.getByText('Transition Interval')).toBeInTheDocument();
    expect(screen.getByText('Select Music Track')).toBeInTheDocument();

    // Check if interval buttons are displayed
    expect(screen.getByText('5s')).toBeInTheDocument();
    expect(screen.getByText('10s')).toBeInTheDocument();
    expect(screen.getByText('20s')).toBeInTheDocument();

    // Check if current interval is displayed correctly
    expect(screen.getByText(/Current: 10s/)).toBeInTheDocument();

    // Check if the selected track is displayed
    expect(screen.getByText('Track 1')).toBeInTheDocument();

    // Close button should be present
    expect(screen.getByRole('button', { name: /Close settings modal/i })).toBeInTheDocument();
  });

  it('shows active state for the currently selected interval', () => {
    render(<SettingsModal {...mockProps} />);

    const button5s = screen.getByText('5s');
    const button10s = screen.getByText('10s');
    const button20s = screen.getByText('20s');

    expect(button5s.className).not.toContain('active');
    expect(button10s.className).toContain('active');
    expect(button20s.className).not.toContain('active');
  });

  it('calls handleIntervalChange when interval buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsModal {...mockProps} />);

    await user.click(screen.getByText('5s'));
    expect(mockProps.handleIntervalChange).toHaveBeenCalledWith(5000);

    await user.click(screen.getByText('20s'));
    expect(mockProps.handleIntervalChange).toHaveBeenCalledWith(20000);
  });

  it('displays saving state when isSaving is true', () => {
    render(<SettingsModal {...mockProps} isSaving={true} />);

    expect(screen.getByText('(saving...)')).toBeInTheDocument();

    // Check if buttons are disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      if (!button.getAttribute('aria-label')?.includes('Close')) {
        expect(button).toBeDisabled();
      }
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsModal {...mockProps} />);

    await user.click(screen.getByRole('button', { name: /Close settings modal/i }));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows track dropdown when dropup header is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsModal {...mockProps} />);

    // Initially the dropdown should be closed
    expect(screen.queryByText('Track 2')).not.toBeInTheDocument();

    // Click the dropdown header
    await user.click(screen.getByText('Track 1'));

    // Now the dropdown should be open
    expect(screen.getByText('Track 2')).toBeInTheDocument();
    expect(screen.getByText('Track 3')).toBeInTheDocument();
  });

  it('calls selectTrack when a track is selected', async () => {
    const mockSelectTrack = vi.fn();
    vi.mocked(useAudio).mockReturnValue({
      tracks: [
        { id: '1', name: 'Track 1' },
        { id: '2', name: 'Track 2' },
        { id: '3', name: 'Track 3' },
      ],
      selectedTrackId: '1',
      selectTrack: mockSelectTrack,
      isTrackSaving: false,
    });

    const user = userEvent.setup();
    render(<SettingsModal {...mockProps} />);

    // Open the dropdown
    await user.click(screen.getByText('Track 1'));

    // Select a different track
    await user.click(screen.getByText('Track 2'));

    expect(mockSelectTrack).toHaveBeenCalledWith('2');
  });

  it('disables track selection when isTrackSaving is true', () => {
    vi.mocked(useAudio).mockReturnValue({
      tracks: [
        { id: '1', name: 'Track 1' },
        { id: '2', name: 'Track 2' },
      ],
      selectedTrackId: '1',
      selectTrack: vi.fn(),
      isTrackSaving: true,
    });

    render(<SettingsModal {...mockProps} />);

    // Find the dropup header and check if it has the 'saving' class
    const dropupHeader = screen.getByText(/Track 1/).closest('.dropup-header');
    expect(dropupHeader).toHaveClass('saving');

    // Check for saving text
    expect(screen.getAllByText('(saving...)')).toHaveLength(1);
  });
});
