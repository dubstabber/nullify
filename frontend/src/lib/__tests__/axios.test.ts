import { describe, it, expect, vi, afterEach } from 'vitest';
vi.resetModules();
const createSpy = vi.fn().mockReturnValue({
  defaults: {
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
  },
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() }
  }
});
vi.mock('axios', () => {
  return {
    default: {
      create: createSpy
    }
  };
});
const { axiosInstance } = await import('../axios');
describe('Axios Instance', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should create an axios instance with the correct baseURL', () => {
    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5000/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
  it('should export an axios instance with the correct properties', () => {
    expect(axiosInstance).toBeDefined();
    expect(axiosInstance.defaults.baseURL).toBe('http://localhost:5000/api');
    expect(axiosInstance.interceptors).toBeDefined();
  });
});
