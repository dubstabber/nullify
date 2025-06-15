import { jest, describe, beforeAll, afterAll, beforeEach, it, expect } from '@jest/globals';
import { setupTestDB, closeTestDB, clearDatabase, setupTestApp, createTestAgent } from './setup.js';
import { mockSongModel } from '../mocks.js';
import songRouter from '../../src/routes/song.route.js';

// Add a default timeout for all tests in this file
jest.setTimeout(15000);

describe('Song API Integration Tests', () => {
  let agent;
  
  // Set up test app before all tests
  beforeAll(async () => {
    await setupTestDB();
    const app = setupTestApp(songRouter);
    agent = createTestAgent(app);
  });
  
  // Clear mocks before each test
  beforeEach(async () => {
    await clearDatabase();
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await closeTestDB();
  });
  
  describe('GET /songs', () => {
    it('should return all songs', async () => {
      // Mock song data
      const mockSongs = [
        {
          _id: 'mock-song-1',
          title: 'Test Song 1',
          artist: 'Test Artist',
          duration: 180
        },
        {
          _id: 'mock-song-2',
          title: 'Test Song 2',
          artist: 'Test Artist',
          duration: 210
        }
      ];

      // Mock find method
      mockSongModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSongs)
      });

      const response = await agent.get('/songs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Test Song 1');
      expect(response.body[1].title).toBe('Test Song 2');
    });
  });

  describe('GET /songs/:id', () => {
    it('should return a song by id', async () => {
      const mockSong = {
        _id: 'mock-song-1',
        title: 'Test Song',
        artist: 'Test Artist',
        duration: 180
      };

      // Mock findById method
      mockSongModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSong)
      });

      const response = await agent.get('/songs/mock-song-1');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Song');
      expect(response.body.artist).toBe('Test Artist');
    });

    it('should return 404 for non-existent song', async () => {
      // Mock findById to return null
      mockSongModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const response = await agent.get('/songs/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /songs/trending', () => {
    it('should return trending songs', async () => {
      const mockTrendingSongs = [
        {
          _id: 'mock-song-1',
          title: 'Trending Song 1',
          artist: 'Test Artist',
          playCount: 100
        },
        {
          _id: 'mock-song-2',
          title: 'Trending Song 2',
          artist: 'Test Artist',
          playCount: 90
        }
      ];

      // Mock aggregate method
      mockSongModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTrendingSongs)
      });

      const response = await agent.get('/songs/trending');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Trending Song 1');
      expect(response.body[1].title).toBe('Trending Song 2');
    });
  });
});
