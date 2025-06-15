import { jest } from '@jest/globals';
describe('Direct Test Pattern', () => {
  test('should mock functionality directly', () => {
    const mockFunction = jest.fn().mockReturnValue('mocked value');
    const result = mockFunction();
    expect(mockFunction).toHaveBeenCalled();
    expect(result).toBe('mocked value');
  });
  test('should mock async functionality', async () => {
    const mockAsyncFunction = jest.fn().mockResolvedValue('mocked async value');
    const result = await mockAsyncFunction();
    expect(mockAsyncFunction).toHaveBeenCalled();
    expect(result).toBe('mocked async value');
  });
  test('should handle errors in async functions', async () => {
    const error = new Error('mock error');
    const mockErrorFunction = jest.fn().mockRejectedValue(error);
    try {
      await mockErrorFunction();
      fail('Should have thrown');
    } catch (e) {
      expect(e).toBe(error);
    }
    expect(mockErrorFunction).toHaveBeenCalled();
  });
});
