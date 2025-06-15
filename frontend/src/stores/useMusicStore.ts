import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import type { Song, Album, Stats } from "@/types";
import type { ApiError } from "@/types/api";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats | null;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
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
  },

  deleteSong: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state: MusicStore) => ({
        songs: state.songs.filter((song: Song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state: MusicStore) => ({
        albums: state.albums.filter((album: Album) => album._id !== id),
        songs: state.songs.map((song: Song) =>
          song.albumId === state.albums.find((a: Album) => a._id === id)?.title
            ? { ...song, albumId: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error("Failed to delete album: " + (apiError.response?.data?.message || apiError.message || "Unknown error"));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ error: apiError.response?.data?.message || 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
