import { jest, describe, beforeAll, afterAll, beforeEach, it, expect } from '@jest/globals';
import { setupTestDB, closeTestDB, clearDatabase, setupTestApp, createTestAgent } from './setup.js';
import { clearMockStores } from '../mock-modules/mocks.js';
import { Album } from '../../src/models/album.model.js';
import { Song } from '../../src/models/song.model.js';
import mongoose from 'mongoose';

describe('Album API Integration Tests', () => {
  let agent;
  
  // Set up database and test app before all tests
  beforeAll(async () => {
    await setupTestDB();
    const app = setupTestApp(albumRouter);
    agent = createTestAgent(app);
  });
  
  // Clear database before each test
  beforeEach(async () => {
    await clearDatabase();
    clearMockStores();
  });
  
  // Close database connection after all tests
  afterAll(async () => {
    await closeTestDB();
  });
  
  describe('GET /albums', () => {
    it('should return an empty array when no albums exist', async () => {
      const response = await agent.get('/albums');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    it('should return all albums', async () => {
      // Create test albums
      await Album.create([
        {
          title: 'Test Album 1',
          artist: 'Test Artist 1',
          imageUrl: 'https://example.com/album1.jpg',
          releaseYear: 2021,
          songs: []
        },
        {
          title: 'Test Album 2',
          artist: 'Test Artist 2',
          imageUrl: 'https://example.com/album2.jpg',
          releaseYear: 2022,
          songs: []
        }
      ]);
      
      const response = await agent.get('/albums');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Test Album 1');
      expect(response.body[1].title).toBe('Test Album 2');
    });
  });
  
  describe('GET /albums/:albumId', () => {
    it('should return a specific album with populated songs', async () => {
      // Create an album
      const album = await Album.create({
        title: 'Test Album',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/album.jpg',
        releaseYear: 2023,
        songs: []
      });
      
      // Create songs for the album
      const song1 = await Song.create({
        title: 'Test Song 1',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/image1.jpg',
        audioUrl: 'https://example.com/audio1.mp3',
        duration: 180,
        albumId: album._id
      });
      
      const song2 = await Song.create({
        title: 'Test Song 2',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/image2.jpg',
        audioUrl: 'https://example.com/audio2.mp3',
        duration: 210,
        albumId: album._id
      });
      
      // Update album with song references
      album.songs = [song1._id, song2._id];
      await album.save();
      
      // Fetch the album
      const response = await agent.get(`/albums/${album._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Album');
      expect(response.body.songs).toHaveLength(2);
      expect(response.body.songs[0].title).toBe('Test Song 1');
      expect(response.body.songs[1].title).toBe('Test Song 2');
    });
    
    it('should return 404 when album does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await agent.get(`/albums/${nonExistentId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Album not found');
    });
    
    it('should handle invalid ObjectId format', async () => {
      const response = await agent.get('/albums/invalid-id');
      
      expect(response.status).toBe(500);
    });
  });
});
