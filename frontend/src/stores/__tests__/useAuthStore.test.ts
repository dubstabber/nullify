import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import { axiosInstance } from '@/lib/axios';
vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));
describe('useAuthStore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useAuthStore.getState().reset();
  });
  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  it('should update isAdmin to true when admin check succeeds', async () => {
    const mockResponse = { data: { admin: true } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);
    await useAuthStore.getState().checkAdminStatus();
    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/check');
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  it('should update isAdmin to false when admin check fails', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Not authenticated'
        }
      }
    };
    vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
    await useAuthStore.getState().checkAdminStatus();
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Not authenticated');
  });
  it('should set a generic error message when API error has no specific message', async () => {
    const mockError = { response: {} };
    vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
    await useAuthStore.getState().checkAdminStatus();
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Authentication error');
  });
  it('should reset the store state', () => {
    const store = useAuthStore.getState();
    useAuthStore.setState({
      isAdmin: true,
      isLoading: true,
      error: 'Some error'
    });
    store.reset();
    const resetState = useAuthStore.getState();
    expect(resetState.isAdmin).toBe(false);
    expect(resetState.isLoading).toBe(false);
    expect(resetState.error).toBe(null);
  });
  it('should set isLoading to true while checking admin status', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(axiosInstance.get).mockReturnValue(promise as any);
    const checkPromise = useAuthStore.getState().checkAdminStatus();
    expect(useAuthStore.getState().isLoading).toBe(true);
    resolvePromise!({ data: { admin: true } });
    await checkPromise;
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
