// Mock cloudinary module for testing
import { jest } from '@jest/globals';

export const uploadToCloudinary = jest.fn().mockResolvedValue({
  secure_url: 'https://test-cloudinary-url.com/image.jpg',
  public_id: 'test-public-id'
});

export const deleteFromCloudinary = jest.fn().mockResolvedValue({ result: 'ok' });

export default {
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://test-cloudinary-url.com/image.jpg',
        public_id: 'test-public-id'
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
};
