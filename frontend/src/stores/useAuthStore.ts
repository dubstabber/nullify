import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { ApiError } from "@/types/api";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({ isAdmin: response.data.admin });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ isAdmin: false, error: apiError.response?.data?.message || 'Authentication error' });
    } finally {
      set({ isLoading: false });
    }
  },
  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
