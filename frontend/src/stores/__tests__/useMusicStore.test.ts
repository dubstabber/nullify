import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMusicStore } from '../useMusicStore';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Mock axios and toast
vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  }
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useMusicStore', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Reset store state before each test
    useMusicStore.setState({
      albums: [],
      songs: [],
      isLoading: false,
      error: null,
      currentAlbum: null,
      madeForYouSongs: [],
      featuredSongs: [],
      trendingSongs: [],
      stats: {
        totalSongs: 0,
        totalAlbums: 0, 
        totalUsers: 0,
        totalArtists: 0,
      }
    });
  });

  describe('fetchStats', () => {
    it('successfully fetches stats', async () => {
      const mockStats = {
        totalSongs: 100,
        totalAlbums: 25,
        totalUsers: 500,
        totalArtists: 30
      };

      (axiosInstance.get as any).mockResolvedValueOnce({ data: mockStats });

      await useMusicStore.getState().fetchStats();
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/stats');
      expect(useMusicStore.getState().stats).toEqual(mockStats);
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(useMusicStore.getState().error).toBeNull();
    });

    it('handles error when fetching stats fails', async () => {
      const errorMessage = 'Network error';
      (axiosInstance.get as any).mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      });

      await useMusicStore.getState().fetchStats();
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/stats');
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(useMusicStore.getState().error).toBe(errorMessage);
      expect(useMusicStore.getState().stats).toEqual({
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0,
      });
    });
  });

  describe('fetchAlbums', () => {
    it('successfully fetches albums', async () => {
      const mockAlbums = [
        { _id: '1', title: 'Album 1', artist: 'Artist 1', imageUrl: '', releaseYear: 2023, songs: [] },
        { _id: '2', title: 'Album 2', artist: 'Artist 2', imageUrl: '', releaseYear: 2022, songs: [] }
      ];

      (axiosInstance.get as any).mockResolvedValueOnce({ data: mockAlbums });

      await useMusicStore.getState().fetchAlbums();
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/albums');
      expect(useMusicStore.getState().albums).toEqual(mockAlbums);
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(useMusicStore.getState().error).toBeNull();
    });

    it('handles error when fetching albums fails', async () => {
      const errorMessage = 'Failed to fetch albums';
      (axiosInstance.get as any).mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      });

      await useMusicStore.getState().fetchAlbums();
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/albums');
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(useMusicStore.getState().error).toBe(errorMessage);
      expect(useMusicStore.getState().albums).toEqual([]);
    });
  });

  describe('fetchAlbumById', () => {
    it('successfully fetches an album by id', async () => {
      const mockAlbum = { 
        _id: '1', 
        title: 'Album 1', 
        artist: 'Artist 1', 
        imageUrl: '', 
        releaseYear: 2023, 
        songs: [] 
      };

      (axiosInstance.get as any).mockResolvedValueOnce({ data: mockAlbum });

      await useMusicStore.getState().fetchAlbumById('1');
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/albums/1');
      expect(useMusicStore.getState().currentAlbum).toEqual(mockAlbum);
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(useMusicStore.getState().error).toBeNull();
    });
  });

  describe('deleteSong', () => {
    it('successfully deletes a song', async () => {
      const mockSongs = [
        { _id: '1', title: 'Song 1', artist: 'Artist 1', albumId: 'album1', imageUrl: '', audioUrl: '', duration: 180, createdAt: '', updatedAt: '' },
        { _id: '2', title: 'Song 2', artist: 'Artist 2', albumId: 'album1', imageUrl: '', audioUrl: '', duration: 200, createdAt: '', updatedAt: '' }
      ];
      
      useMusicStore.setState({ songs: mockSongs });
      (axiosInstance.delete as any).mockResolvedValueOnce({});

      await useMusicStore.getState().deleteSong('1');
      
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/songs/1');
      expect(useMusicStore.getState().songs).toEqual([mockSongs[1]]);
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Song deleted successfully');
    });

    it('handles error when deleting song fails', async () => {
      const mockSongs = [
        { _id: '1', title: 'Song 1', artist: 'Artist 1', albumId: 'album1', imageUrl: '', audioUrl: '', duration: 180, createdAt: '', updatedAt: '' }
      ];
      
      useMusicStore.setState({ songs: mockSongs });
      (axiosInstance.delete as any).mockRejectedValueOnce(new Error('Failed to delete'));

      await useMusicStore.getState().deleteSong('1');
      
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/songs/1');
      expect(useMusicStore.getState().songs).toEqual(mockSongs); // Songs remain unchanged
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Error deleting song');
    });
  });

  describe('deleteAlbum', () => {
    it('successfully deletes an album and updates associated songs', async () => {
      const mockAlbums = [
        { _id: 'album1', title: 'Album 1', artist: 'Artist 1', imageUrl: '', releaseYear: 2023, songs: [] },
        { _id: 'album2', title: 'Album 2', artist: 'Artist 2', imageUrl: '', releaseYear: 2022, songs: [] }
      ];
      
      const mockSongs = [
        { _id: '1', title: 'Song 1', artist: 'Artist 1', albumId: 'Album 1', imageUrl: '', audioUrl: '', duration: 180, createdAt: '', updatedAt: '' },
        { _id: '2', title: 'Song 2', artist: 'Artist 2', albumId: 'Album 2', imageUrl: '', audioUrl: '', duration: 200, createdAt: '', updatedAt: '' }
      ];
      
      useMusicStore.setState({ albums: mockAlbums, songs: mockSongs });
      (axiosInstance.delete as any).mockResolvedValueOnce({});

      await useMusicStore.getState().deleteAlbum('album1');
      
      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/albums/album1');
      expect(useMusicStore.getState().albums).toEqual([mockAlbums[1]]);
      
      // Check that songs associated with Album 1 now have albumId set to null
      expect(useMusicStore.getState().songs[0].albumId).toBeNull();
      expect(useMusicStore.getState().songs[1].albumId).toBe('Album 2'); // Other songs remain unchanged
      
      expect(useMusicStore.getState().isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Album deleted successfully');
    });
  });
});
