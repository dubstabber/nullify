import { jest } from '@jest/globals';

// Mock cloudinary
const cloudinary = {
  config: jest.fn(),
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'https://example.com/test.jpg' }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' })
  }
};

// Create a mock module that matches the cloudinary package structure
const mockModule = {
  __esModule: true,
  default: cloudinary,
  v2: cloudinary,
  config: cloudinary.config,
  uploader: cloudinary.uploader
};

// Export both the module and its properties
export { cloudinary as v2 };
export default cloudinary; 