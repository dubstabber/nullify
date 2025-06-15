import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import { axiosInstance } from '@/lib/axios';

// Mock axios
vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

describe('useAuthStore', () => {
  // Reset the store before each test
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
    // Mock successful API response
    const mockResponse = { data: { admin: true } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);
    
    // Call the checkAdminStatus method
    await useAuthStore.getState().checkAdminStatus();
    
    // Check if the API was called with the correct endpoint
    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/check');
    
    // Check if the store was updated correctly
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  
  it('should update isAdmin to false when admin check fails', async () => {
    // Mock failed API response
    const mockError = {
      response: {
        data: {
          message: 'Not authenticated'
        }
      }
    };
    vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
    
    // Call the checkAdminStatus method
    await useAuthStore.getState().checkAdminStatus();
    
    // Check if the store was updated correctly
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Not authenticated');
  });
  
  it('should set a generic error message when API error has no specific message', async () => {
    // Mock failed API response with no message
    const mockError = { response: {} };
    vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
    
    // Call the checkAdminStatus method
    await useAuthStore.getState().checkAdminStatus();
    
    // Check if the store was updated correctly
    const state = useAuthStore.getState();
    expect(state.isAdmin).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Authentication error');
  });
  
  it('should reset the store state', () => {
    // Set some values first
    const store = useAuthStore.getState();
    useAuthStore.setState({
      isAdmin: true,
      isLoading: true,
      error: 'Some error'
    });
    
    // Call reset
    store.reset();
    
    // Check if the store was reset correctly
    const resetState = useAuthStore.getState();
    expect(resetState.isAdmin).toBe(false);
    expect(resetState.isLoading).toBe(false);
    expect(resetState.error).toBe(null);
  });
  
  it('should set isLoading to true while checking admin status', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    // Mock axios to use our controlled promise
    vi.mocked(axiosInstance.get).mockReturnValue(promise as any);
    
    // Start the admin check
    const checkPromise = useAuthStore.getState().checkAdminStatus();
    
    // Check if isLoading is true during the request
    expect(useAuthStore.getState().isLoading).toBe(true);
    
    // Resolve the promise
    resolvePromise!({ data: { admin: true } });
    
    // Wait for the store to update
    await checkPromise;
    
    // Check if isLoading is false after the request
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
