import { jest } from '@jest/globals';
import request from 'supertest';
const API_BASE_URL = 'http://localhost:5000';
describe('Album API Integration Tests', () => {
  describe('GET /api/albums', () => {
    it('should return all albums', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/albums');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  describe('GET /api/albums/:albumId', () => {
    it('should handle invalid ObjectId format', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/albums/invalid-id');
      expect(response.status).toBe(500);
    });
    it('should return 404 when album does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(API_BASE_URL)
        .get(`/api/albums/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Album not found');
    });
  });
});
