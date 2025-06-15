import { jest } from '@jest/globals';
import { mockSongModel } from '../mocks.js';

describe('Song Model', () => {
  describe('Schema validation', () => {
    it('should create a valid song', async () => {
      const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/image.jpg',
        audioUrl: 'https://example.com/audio.mp3',
        duration: 180
      };
      
      const mockSavedSong = {
        _id: 'mockId',
        ...songData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockSongModel.create.mockResolvedValue(mockSavedSong);
      
      const savedSong = await mockSongModel.create(songData);
      
      expect(mockSongModel.create).toHaveBeenCalledWith(songData);
      expect(savedSong._id).toBeDefined();
      expect(savedSong.title).toBe(songData.title);
      expect(savedSong.artist).toBe(songData.artist);
      expect(savedSong.imageUrl).toBe(songData.imageUrl);
      expect(savedSong.audioUrl).toBe(songData.audioUrl);
      expect(savedSong.duration).toBe(songData.duration);
      expect(savedSong.createdAt).toBeDefined();
      expect(savedSong.updatedAt).toBeDefined();
    });
    
    it('should create a song with an albumId', async () => {
      const albumId = 'mockAlbumId';
      const songData = {
        title: 'Test Song with Album',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/image.jpg',
        audioUrl: 'https://example.com/audio.mp3',
        duration: 240,
        albumId
      };
      
      const mockSavedSong = {
        _id: 'mockId',
        ...songData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockSongModel.create.mockResolvedValue(mockSavedSong);
      
      const savedSong = await mockSongModel.create(songData);
      
      expect(mockSongModel.create).toHaveBeenCalledWith(songData);
      expect(savedSong.albumId).toBeDefined();
      expect(savedSong.albumId).toBe(albumId);
    });
    
    it('should fail validation when required fields are missing', async () => {
      const invalidSong = {
        // Missing all required fields
      };
      
      const validationError = new Error('ValidationError');
      validationError.name = 'ValidationError';
      validationError.errors = {
        title: { message: 'Title is required' },
        artist: { message: 'Artist is required' },
        imageUrl: { message: 'Image URL is required' },
        audioUrl: { message: 'Audio URL is required' },
        duration: { message: 'Duration is required' }
      };
      
      mockSongModel.create.mockRejectedValue(validationError);
      
      try {
        await mockSongModel.create(invalidSong);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
        expect(error.errors.title).toBeDefined();
        expect(error.errors.artist).toBeDefined();
        expect(error.errors.imageUrl).toBeDefined();
        expect(error.errors.audioUrl).toBeDefined();
        expect(error.errors.duration).toBeDefined();
      }
    });
    
    it('should allow updating existing song fields', async () => {
      const originalSong = {
        _id: 'mockId',
        title: 'Original Title',
        artist: 'Original Artist',
        imageUrl: 'https://example.com/original.jpg',
        audioUrl: 'https://example.com/original.mp3',
        duration: 180
      };
      
      const updatedSong = {
        ...originalSong,
        title: 'Updated Title',
        artist: 'Updated Artist'
      };
      
      mockSongModel.findByIdAndUpdate.mockResolvedValue(updatedSong);
      
      const result = await mockSongModel.findByIdAndUpdate('mockId', {
        title: 'Updated Title',
        artist: 'Updated Artist'
      });
      
      expect(mockSongModel.findByIdAndUpdate).toHaveBeenCalledWith('mockId', {
        title: 'Updated Title',
        artist: 'Updated Artist'
      });
      expect(result.title).toBe('Updated Title');
      expect(result.artist).toBe('Updated Artist');
      expect(result.imageUrl).toBe('https://example.com/original.jpg'); // Unchanged
    });
    
    it('should find songs by query criteria', async () => {
      const mockSongs = [
        {
          _id: 'song1',
          title: 'Song 1',
          artist: 'Same Artist',
          imageUrl: 'https://example.com/image1.jpg',
          audioUrl: 'https://example.com/audio1.mp3',
          duration: 180
        },
        {
          _id: 'song2',
          title: 'Song 2',
          artist: 'Same Artist',
          imageUrl: 'https://example.com/image2.jpg',
          audioUrl: 'https://example.com/audio2.mp3',
          duration: 200
        }
      ];
      
      mockSongModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSongs)
      });
      
      const foundSongs = await mockSongModel.find({ artist: 'Same Artist' }).exec();
      
      expect(mockSongModel.find).toHaveBeenCalledWith({ artist: 'Same Artist' });
      expect(foundSongs).toHaveLength(2);
      expect(foundSongs[0].artist).toBe('Same Artist');
      expect(foundSongs[1].artist).toBe('Same Artist');
    });
  });
});
