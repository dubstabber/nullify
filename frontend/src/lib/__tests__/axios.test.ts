import { describe, it, expect, vi, afterEach } from 'vitest';

// Reset modules to get a fresh import each time
vi.resetModules();

// Setup spy before importing the module we want to test
const createSpy = vi.fn().mockReturnValue({
  defaults: {
    baseURL: 'http://localhost:5000/api',
    headers: {},
  },
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() }
  }
});

// Mock axios module
vi.mock('axios', () => {
  return {
    default: {
      create: createSpy
    }
  };
});

// Now import the module we want to test
const { axiosInstance } = await import('../axios');

describe('Axios Instance', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an axios instance with the correct baseURL', () => {
    // Test that our axios create function was called correctly
    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5000/api'
    });
  });

  it('should export an axios instance with the correct properties', () => {
    // Verify that axiosInstance is properly initialized with expected properties
    expect(axiosInstance).toBeDefined();
    expect(axiosInstance.defaults.baseURL).toBe('http://localhost:5000/api');
    expect(axiosInstance.interceptors).toBeDefined();
  });
});

