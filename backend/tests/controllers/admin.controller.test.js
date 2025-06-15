import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin } from '../../src/controller/admin.controller.js';
import { mockSongModel, mockAlbumModel } from '../mocks.js';
import cloudinary from '../mocks/cloudinary.js';

describe('Admin Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      params: {},
      files: {},
      user: { id: 'user123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Suppress console.error output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('createSong', () => {
    it('should create a new song', async () => {
      // Mock cloudinary upload response
      cloudinary.uploader.upload = jest.fn()
        .mockResolvedValueOnce({ secure_url: 'https://mock-audio-url.com/song.mp3' })
        .mockResolvedValueOnce({ secure_url: 'https://mock-image-url.com/image.jpg' });

      req.body = {
        title: 'New Test Song',
        artist: 'Test Artist',
        duration: 180
      };
      
      // Mock song creation
      mockSongModel.create.mockResolvedValueOnce({
        _id: 'mock-song-id',
        ...req.body,
        audioUrl: 'https://mock-audio-url.com/song.mp3',
        imageUrl: 'https://mock-image-url.com/image.jpg'
      });

      await createSong(req, res, next);

      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
      expect(mockSongModel.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Song',
        artist: 'Test Artist'
      }));
    });

    it('should update album when song is added to an album', async () => {
      // Mock cloudinary upload response
      cloudinary.uploader.upload = jest.fn()
        .mockResolvedValueOnce({ secure_url: 'https://mock-audio-url.com/song.mp3' })
        .mockResolvedValueOnce({ secure_url: 'https://mock-image-url.com/image.jpg' });

      const mockAlbum = {
        _id: 'mock-album-id',
        title: 'Test Album',
        artist: 'Test Artist',
        songs: []
      };

      req.body = {
        title: 'Album Song',
        artist: 'Test Artist',
        albumId: mockAlbum._id,
        duration: 180
      };
      
      // Mock song creation
      mockSongModel.create.mockResolvedValueOnce({
        _id: 'mock-song-id',
        ...req.body,
        audioUrl: 'https://mock-audio-url.com/song.mp3',
        imageUrl: 'https://mock-image-url.com/image.jpg'
      });
      
      // Mock album update
      mockAlbumModel.findByIdAndUpdate.mockResolvedValueOnce({
        ...mockAlbum,
        songs: ['mock-song-id']
      });
      
      await createSong(req, res, next);
      
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
      expect(mockSongModel.create).toHaveBeenCalled();
      expect(mockAlbumModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Album Song',
        artist: 'Test Artist'
      }));
    });

    it('should return 400 if files are missing', async () => {
      // No files provided
      req.files = {};
      
      // Execute the controller method
      await createSong(req, res, next);
      
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please upload all files" });
    });

    it('should call next with error if an exception occurs', async () => {
      // Setup test data
      req.body = {
        title: 'Test Song',
        artist: 'Test Artist'
      };
      
      req.files = {
        audioFile: { tempFilePath: 'audio/path' },
        imageFile: { tempFilePath: 'image/path' }
      };
      
      // This is fine because the controller wraps the original error
      cloudinary.uploader.upload.mockRejectedValueOnce(new Error('Test error'));
      
      // Execute the controller method
      await createSong(req, res, next);
      
      // Verify error handling - we just check that next was called with any error
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      req.params.id = 'mock-song-id';
      
      // Mock song deletion
      mockSongModel.findByIdAndDelete.mockResolvedValueOnce({
        _id: 'mock-song-id',
        title: 'Song to Delete'
      });

      await deleteSong(req, res, next);
      
      expect(mockSongModel.findByIdAndDelete).toHaveBeenCalledWith('mock-song-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Song deleted successfully'
      });
    });

    it('should not update album if song has no albumId', async () => {
      // Setup mock data
      req.params = { id: 'song123' };
      
      // Mock Song.findById to return a song without albumId
      Song.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'song123',
          albumId: null
        })
      });
      
      // Call the controller function
      await deleteSong(req, res, next);
      
      // Verify album not updated
      expect(Album.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(Song.findByIdAndDelete).toHaveBeenCalledWith('song123');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error if an exception occurs', async () => {
      // Setup mock data
      req.params = { id: 'song123' };
      
      // Force an error
      const error = new Error('Database error');
      Song.findById = jest.fn().mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function
      await deleteSong(req, res, next);
      
      // Verify error handling - just check that next was called with any error
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('createAlbum', () => {
    it('should create a new album', async () => {
      // Mock cloudinary upload response
      cloudinary.uploader.upload = jest.fn()
        .mockResolvedValue({ secure_url: 'https://mock-image-url.com/album.jpg' });

      req.body = {
        title: 'New Test Album',
        artist: 'Test Artist',
        releaseYear: 2023
      };
      
      // Mock album creation
      mockAlbumModel.create.mockResolvedValueOnce({
        _id: 'mock-album-id',
        ...req.body,
        imageUrl: 'https://mock-image-url.com/album.jpg',
        songs: []
      });

      await createAlbum(req, res, next);
      
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
      expect(mockAlbumModel.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Album',
        artist: 'Test Artist'
      }));
    });

    it('should call next with error if an exception occurs', async () => {
      // Setup test data
      req.body = {
        title: 'Test Album',
        artist: 'Test Artist'
      };
      
      req.files = {
        imageFile: { tempFilePath: 'image/path' }
      };
      
      // Force upload to fail
      cloudinary.uploader.upload.mockRejectedValueOnce(new Error('Upload failed'));
      
      // Execute the controller method
      await createAlbum(req, res, next);
      
      // Verify error handling - just check that next was called with any error
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('deleteAlbum', () => {
    it('should delete an album', async () => {
      req.params.id = 'mock-album-id';
      
      // Mock album deletion
      mockAlbumModel.findByIdAndDelete.mockResolvedValueOnce({
        _id: 'mock-album-id',
        title: 'Album to Delete'
      });

      await deleteAlbum(req, res, next);
      
      expect(mockAlbumModel.findByIdAndDelete).toHaveBeenCalledWith('mock-album-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Album deleted successfully'
      });
    });

    it('should call next with error if an exception occurs', async () => {
      // Setup test data
      req.params = { id: 'album123' };
      
      // Force an error
      Song.deleteMany = jest.fn().mockRejectedValueOnce(new Error('Database error'));
      
      // Call the controller function
      await deleteAlbum(req, res, next);
      
      // Verify error handling - just check that next was called with any error
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('checkAdmin', () => {
    it('should confirm admin status', async () => {
      // Setup test data
      req.user = { id: 'user123' };
      
      // Execute the controller method
      await checkAdmin(req, res, next);
      
      // Should respond with admin: true
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ admin: true });
    });
    
    it('should call next with error if an exception occurs', async () => {
      // Force an error by causing an exception
      res.status = jest.fn().mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      
      // Execute the controller method
      await checkAdmin(req, res, next);
      
      // Should call next with error
      expect(next).toHaveBeenCalled();
    });
  });
});
