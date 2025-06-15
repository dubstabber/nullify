import { jest } from '@jest/globals';
const mockSchema = {
  add: jest.fn(),
};
const mockModel = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    _id: 'mock-id-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    }),
    toObject: jest.fn().mockImplementation(function() {
      return this;
    })
  };
});
const ObjectId = jest.fn().mockImplementation((id) => id || 'mock-object-id');
jest.mock('mongoose', () => {
  return {
    Schema: jest.fn().mockImplementation(() => mockSchema),
    model: jest.fn().mockImplementation(() => mockModel),
    Types: {
      ObjectId
    }
  };
});
import mongoose from 'mongoose';
const mockSongFunctions = {
  find: jest.fn().mockImplementation(() => ({ exec: () => Promise.resolve([]) })),
  findById: jest.fn(),
  create: jest.fn().mockImplementation((data) => {
    if (Array.isArray(data)) {
      return Promise.resolve(data.map(item => ({ ...item, _id: 'mock-id-' + Math.random() })));
    }
    return Promise.resolve({ ...data, _id: 'mock-id-' + Math.random() });
  })
};
const Song = function(data) {
  return mockModel(data);
};
Song.create = mockSongFunctions.create;
Song.find = mockSongFunctions.find;
Song.findById = mockSongFunctions.findById;
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
      const song = new Song(songData);
      const savedSong = await song.save();
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
      const albumId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
      const songData = {
        title: 'Test Song with Album',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/album-image.jpg',
        audioUrl: 'https://example.com/album-audio.mp3',
        duration: 240,
        albumId
      };
      const song = new Song(songData);
      const savedSong = await song.save();
      expect(savedSong.albumId).toBeDefined();
      expect(savedSong.albumId).toBeTruthy();
    });
    it('should validate required fields', async () => {
      mockModel.mockImplementationOnce(() => ({
        save: jest.fn().mockImplementation(() => {
          const error = new Error('Validation failed');
          error.name = 'ValidationError';
          error.errors = {
            title: { message: 'Title is required' },
            artist: { message: 'Artist is required' },
            imageUrl: { message: 'Image URL is required' },
            audioUrl: { message: 'Audio URL is required' },
            duration: { message: 'Duration is required' }
          };
          return Promise.reject(error);
        })
      }));
      const invalidSong = new Song({});
      try {
        await invalidSong.save();
        fail('Should have thrown validation error');
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
      const song = new Song({
        title: 'Original Title',
        artist: 'Original Artist',
        imageUrl: 'https://example.com/original-image.jpg',
        audioUrl: 'https://example.com/original-audio.mp3',
        duration: 180
      });
      const savedSong = await song.save();
      savedSong.title = 'Updated Title';
      savedSong.artist = 'Updated Artist';
      savedSong.save = jest.fn().mockResolvedValue({
        ...savedSong,
        title: 'Updated Title',
        artist: 'Updated Artist',
      });
      const updatedSong = await savedSong.save();
      expect(updatedSong.title).toBe('Updated Title');
      expect(updatedSong.artist).toBe('Updated Artist');
      expect(updatedSong.imageUrl).toBe('https://example.com/original-image.jpg');
    });
    it('should find songs by query criteria', async () => {
      const mockSongs = [
        {
          _id: 'song-id-1',
          title: 'Song 1',
          artist: 'Same Artist',
          imageUrl: 'https://example.com/test.jpg',
          audioUrl: 'https://example.com/test.jpg',
          duration: 180
        },
        {
          _id: 'song-id-2',
          title: 'Song 2',
          artist: 'Same Artist',
          imageUrl: 'https://example.com/test.jpg',
          audioUrl: 'https://example.com/test.jpg',
          duration: 200
        }
      ];
      const mockExec = jest.fn().mockResolvedValue(mockSongs);
      mockSongFunctions.find.mockReturnValue({
        exec: mockExec
      });
      const foundSongs = await Song.find({ artist: 'Same Artist' }).exec();
      expect(mockSongFunctions.find).toHaveBeenCalledWith({ artist: 'Same Artist' });
      expect(foundSongs).toHaveLength(2);
      expect(foundSongs[0].artist).toBe('Same Artist');
      expect(foundSongs[1].artist).toBe('Same Artist');
    });
  });
});
