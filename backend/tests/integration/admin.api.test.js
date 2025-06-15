import { jest } from '@jest/globals';
import request from 'supertest';
const API_BASE_URL = 'http://localhost:5000';
describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('POST /api/admin/songs', () => {
    it('should return 401 for protected endpoint without authentication', async () => {
      const songData = {
          title: 'New Test Song',
          artist: 'Test Artist',
          duration: 180
      };
      const response = await request(API_BASE_URL)
        .post('/api/admin/songs')
        .field('title', songData.title)
        .field('artist', songData.artist)
        .field('duration', songData.duration)
        .attach('audioFile', 'test/fixtures/test-audio.mp3')
        .attach('imageFile', 'test/fixtures/test-image.jpg');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized - you must be logged in');
    });
  });
  describe('DELETE /api/admin/songs/:id', () => {
    it('should return 401 for protected endpoint without authentication', async () => {
      const songId = '507f1f77bcf86cd799439011';
      const response = await request(API_BASE_URL)
        .delete(`/api/admin/songs/${songId}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized - you must be logged in');
    });
  });
  describe('POST /api/admin/albums', () => {
    it('should return 401 for protected endpoint without authentication', async () => {
      const albumData = {
          title: 'New Test Album',
          artist: 'Test Artist',
          releaseYear: 2023
      };
      const response = await request(API_BASE_URL)
        .post('/api/admin/albums')
        .field('title', albumData.title)
        .field('artist', albumData.artist)
        .field('releaseYear', albumData.releaseYear)
        .attach('imageFile', 'test/fixtures/test-image.jpg');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized - you must be logged in');
    });
  });
  describe('DELETE /api/admin/albums/:id', () => {
    it('should return 401 for protected endpoint without authentication', async () => {
      const albumId = '507f1f77bcf86cd799439011';
      const response = await request(API_BASE_URL)
        .delete(`/api/admin/albums/${albumId}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized - you must be logged in');
    });
  });
});
