import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerStore } from '../usePlayerStore';
import type { Song } from '@/types';
const mockSocketEmit = vi.fn();
vi.mock('../useChatStore', () => {
  return {
    useChatStore: {
      getState: () => ({
        socket: {
          auth: { userId: 'user123' },
          emit: mockSocketEmit,
        },
      }),
    },
  };
});
const buildSong = (id: string): Song => ({
  _id: id,
  title: `Song ${id}`,
  artist: `Artist ${id}`,
  albumId: `album-${id}`,
  imageUrl: '',
  audioUrl: '',
  duration: 180,
  createdAt: '',
  updatedAt: '',
});
describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentSong: null,
      isPlaying: false,
      queue: [],
      currentIndex: -1,
    });
    vi.clearAllMocks();
  });
  it('initializes queue & sets first song if none selected', () => {
    const songs = [buildSong('1'), buildSong('2')];
    usePlayerStore.getState().initializeQueue(songs);
    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(songs);
    expect(state.currentSong?._id).toBe('1');
    expect(state.currentIndex).toBe(0);
  });
  it('plays album from given index', () => {
    const songs = [buildSong('1'), buildSong('2'), buildSong('3')];
    usePlayerStore.getState().playAlbum(songs, 2);
    const state = usePlayerStore.getState();
    expect(state.currentSong?._id).toBe('3');
    expect(state.currentIndex).toBe(2);
    expect(state.isPlaying).toBe(true);
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Playing Song 3 by Artist 3'
    });
  });
  it('toggles play/pause', () => {
    const song = buildSong('1');
    usePlayerStore.setState({ currentSong: song, isPlaying: false });
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Playing Song 1 by Artist 1'
    });
    mockSocketEmit.mockClear();
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Idle'
    });
  });
  it('plays next and previous correctly within queue bounds', () => {
    const songs = [buildSong('1'), buildSong('2'), buildSong('3')];
    usePlayerStore.getState().playAlbum(songs, 0);
    mockSocketEmit.mockClear();
    usePlayerStore.getState().playNext();
    expect(usePlayerStore.getState().currentSong?._id).toBe('2');
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Playing Song 2 by Artist 2'
    });
    mockSocketEmit.mockClear();
    usePlayerStore.getState().playPrevious();
    expect(usePlayerStore.getState().currentSong?._id).toBe('1');
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Playing Song 1 by Artist 1'
    });
  });
  it('handles boundary conditions when playing next at the end of queue', () => {
    const songs = [buildSong('1'), buildSong('2')];
    usePlayerStore.getState().playAlbum(songs, 1);
    mockSocketEmit.mockClear();
    usePlayerStore.getState().playNext();
    expect(usePlayerStore.getState().currentIndex).toBe(1);
    expect(usePlayerStore.getState().currentSong?._id).toBe('2');
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });
  it('handles boundary conditions when playing previous at the start of queue', () => {
    const songs = [buildSong('1'), buildSong('2')];
    usePlayerStore.getState().playAlbum(songs, 0);
    mockSocketEmit.mockClear();
    usePlayerStore.getState().playPrevious();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(usePlayerStore.getState().currentSong?._id).toBe('1');
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Idle'
    });
  });
  it('setCurrentSong updates the current song and plays it', () => {
    const songs = [buildSong('1'), buildSong('2'), buildSong('3')];
    usePlayerStore.setState({ queue: songs, currentIndex: 0, currentSong: songs[0], isPlaying: false });
    mockSocketEmit.mockClear();
    usePlayerStore.getState().setCurrentSong(songs[1]);
    expect(usePlayerStore.getState().currentSong?._id).toBe('2');
    expect(usePlayerStore.getState().currentIndex).toBe(1);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(mockSocketEmit).toHaveBeenCalledWith('update_activity', {
      userId: 'user123',
      activity: 'Playing Song 2 by Artist 2'
    });
  });
});
