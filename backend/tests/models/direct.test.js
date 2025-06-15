import { jest } from '@jest/globals';

describe('Direct Test Pattern', () => {
  test('should mock functionality directly', () => {
    // Mock function
    const mockFunction = jest.fn().mockReturnValue('mocked value');
    
    // Call the mock
    const result = mockFunction();
    
    // Assert
    expect(mockFunction).toHaveBeenCalled();
    expect(result).toBe('mocked value');
  });
  
  test('should mock async functionality', async () => {
    // Mock async function
    const mockAsyncFunction = jest.fn().mockResolvedValue('mocked async value');
    
    // Call the mock
    const result = await mockAsyncFunction();
    
    // Assert
    expect(mockAsyncFunction).toHaveBeenCalled();
    expect(result).toBe('mocked async value');
  });
  
  test('should handle errors in async functions', async () => {
    // Mock function that throws
    const error = new Error('mock error');
    const mockErrorFunction = jest.fn().mockRejectedValue(error);
    
    // Call and handle error
    try {
      await mockErrorFunction();
      fail('Should have thrown');
    } catch (e) {
      expect(e).toBe(error);
    }
    
    // Assert
    expect(mockErrorFunction).toHaveBeenCalled();
  });
});
