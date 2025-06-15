import { jest } from '@jest/globals';
import request from 'supertest';
const API_BASE_URL = 'http://localhost:5000';
describe('Song API Integration Tests', () => {
  describe('GET /api/songs', () => {
    it('should return 401 for protected endpoint without authentication', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/songs');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized - you must be logged in');
    });
  });
  describe('GET /api/songs/featured', () => {
    it('should return featured songs', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/songs/featured');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  describe('GET /api/songs/made-for-you', () => {
    it('should return made for you songs', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/songs/made-for-you');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  describe('GET /api/songs/trending', () => {
    it('should return trending songs', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/songs/trending');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
