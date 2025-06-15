import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../mocks/app.js';
import { mockSongModel, mockAlbumModel } from '../mocks.js';
import cloudinary from '../mocks/cloudinary.js';

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/admin/songs', () => {
    it('should create a new song', async () => {
      // Mock cloudinary upload response
      cloudinary.uploader.upload = jest.fn()
        .mockResolvedValueOnce({ secure_url: 'https://mock-audio-url.com/song.mp3' })
        .mockResolvedValueOnce({ secure_url: 'https://mock-image-url.com/image.jpg' });
      
      const songData = {
          title: 'New Test Song',
          artist: 'Test Artist',
          duration: 180
      };

      // Mock song creation
      mockSongModel.create.mockResolvedValueOnce({
        _id: 'mock-song-id',
        ...songData,
        audioUrl: 'https://mock-audio-url.com/song.mp3',
        imageUrl: 'https://mock-image-url.com/image.jpg'
      });
      
      const response = await request(app)
        .post('/api/admin/songs')
        .field('title', songData.title)
        .field('artist', songData.artist)
        .field('duration', songData.duration)
        .attach('audioFile', 'test/fixtures/test-audio.mp3')
        .attach('coverImage', 'test/fixtures/test-image.jpg');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', songData.title);
      expect(response.body).toHaveProperty('artist', songData.artist);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
      expect(mockSongModel.create).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/admin/songs/:id', () => {
    it('should delete a song', async () => {
      const songId = 'mock-song-id';

      // Mock song deletion
      mockSongModel.findByIdAndDelete.mockResolvedValueOnce({
        _id: songId,
        title: 'Song to Delete'
      });
      
      const response = await request(app)
        .delete(`/api/admin/songs/${songId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Song deleted successfully');
      expect(mockSongModel.findByIdAndDelete).toHaveBeenCalledWith(songId);
    });
  });
  
  describe('POST /api/admin/albums', () => {
    it('should create a new album', async () => {
      // Mock cloudinary upload response
      cloudinary.uploader.upload = jest.fn()
        .mockResolvedValue({ secure_url: 'https://mock-image-url.com/album.jpg' });
      
      const albumData = {
          title: 'New Test Album',
          artist: 'Test Artist',
          releaseYear: 2023
      };

      // Mock album creation
      mockAlbumModel.create.mockResolvedValueOnce({
        _id: 'mock-album-id',
        ...albumData,
        imageUrl: 'https://mock-image-url.com/album.jpg',
        songs: []
      });

      const response = await request(app)
        .post('/api/admin/albums')
        .field('title', albumData.title)
        .field('artist', albumData.artist)
        .field('releaseYear', albumData.releaseYear)
        .attach('coverImage', 'test/fixtures/test-image.jpg');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', albumData.title);
      expect(response.body).toHaveProperty('artist', albumData.artist);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
      expect(mockAlbumModel.create).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/admin/albums/:id', () => {
    it('should delete an album', async () => {
      const albumId = 'mock-album-id';
      
      // Mock album deletion
      mockAlbumModel.findByIdAndDelete.mockResolvedValueOnce({
        _id: albumId,
        title: 'Album to Delete'
      });
      
      const response = await request(app)
        .delete(`/api/admin/albums/${albumId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Album deleted successfully');
      expect(mockAlbumModel.findByIdAndDelete).toHaveBeenCalledWith(albumId);
    });
  });
});
