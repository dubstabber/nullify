import { jest } from '@jest/globals';
import { 
  getAllSongs, 
  getFeaturedSongs, 
  getMadeForYouSongs, 
  getTrendingSongs 
} from '../../src/controller/song.controller.js';
import { mockSongModel } from '../mocks.js';

// Set a longer timeout for all tests in this file
jest.setTimeout(15000);

// Mock the Song model in the controller
jest.mock('../../src/models/song.model.js', () => ({
  Song: mockSongModel
}));

describe('Song Controller', () => {
  let req;
  let res;
  let next;
  const mockSongs = [
    { 
      _id: 'song1', 
      title: 'Test Song 1', 
      artist: 'Test Artist 1',
      albumId: 'album1',
      imageUrl: 'image1.jpg',
      audioUrl: 'audio1.mp3',
      duration: 180,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02'
    },
    { 
      _id: 'song2', 
      title: 'Test Song 2', 
      artist: 'Test Artist 2',
      albumId: 'album2',
      imageUrl: 'image2.jpg',
      audioUrl: 'audio2.mp3',
      duration: 240,
      createdAt: '2023-02-01',
      updatedAt: '2023-02-02'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('getAllSongs', () => {
    it('should return all songs sorted by createdAt in descending order', async () => {
      // Setup mock implementation for this test
      mockSongModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockSongs)
        })
      });

      // Call the controller function
      await getAllSongs(req, res, next);

      // Verify the response
      expect(mockSongModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
    });

    it('should call next with error if an exception occurs', async () => {
      // Simulate a database error
      const testError = new Error('Database error');
      mockSongModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(testError)
        })
      });

      // Call the controller function
      await getAllSongs(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });

  describe('getFeaturedSongs', () => {
    const projectedSongs = [
      { 
        _id: 'song1', 
        title: 'Test Song 1', 
        artist: 'Test Artist 1',
        imageUrl: 'image1.jpg',
        audioUrl: 'audio1.mp3'
      },
      { 
        _id: 'song2', 
        title: 'Test Song 2', 
        artist: 'Test Artist 2',
        imageUrl: 'image2.jpg',
        audioUrl: 'audio2.mp3'
      }
    ];
    
    it('should return featured songs with specific fields', async () => {
      // Setup mock implementation
      mockSongModel.aggregate.mockResolvedValue(projectedSongs);
      
      // Call the controller function
      await getFeaturedSongs(req, res, next);

      // Check if the response was as expected
      expect(mockSongModel.aggregate).toHaveBeenCalledWith([
        { $sample: { size: 6 } },
        { 
          $project: {
            _id: 1,
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1
          }
        }
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projectedSongs);
    });

    it('should call next with error if an exception occurs', async () => {
      // Simulate a database error
      const testError = new Error('Aggregate error');
      mockSongModel.aggregate.mockRejectedValue(testError);

      // Call the controller function
      await getFeaturedSongs(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });

  describe('getMadeForYouSongs', () => {
    const projectedSongs = [
      { 
        _id: 'song1', 
        title: 'Test Song 1', 
        artist: 'Test Artist 1',
        imageUrl: 'image1.jpg',
        audioUrl: 'audio1.mp3'
      },
      { 
        _id: 'song2', 
        title: 'Test Song 2', 
        artist: 'Test Artist 2',
        imageUrl: 'image2.jpg',
        audioUrl: 'audio2.mp3'
      }
    ];
    
    it('should return personalized songs with specific fields', async () => {      
      // Setup mock implementation
      mockSongModel.aggregate.mockResolvedValue(projectedSongs);
      
      // Call the controller function
      await getMadeForYouSongs(req, res, next);

      // Check if the response was as expected
      expect(mockSongModel.aggregate).toHaveBeenCalledWith([
        { $sample: { size: 4 } },
        { 
          $project: {
            _id: 1,
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1
          }
        }
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projectedSongs);
    });

    it('should call next with error if an exception occurs', async () => {
      // Simulate a database error
      const testError = new Error('Database error');
      mockSongModel.aggregate.mockRejectedValue(testError);

      // Call the controller function
      await getMadeForYouSongs(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });

  describe('getTrendingSongs', () => {
    const projectedSongs = [
      { 
        _id: 'song1', 
        title: 'Test Song 1', 
        artist: 'Test Artist 1',
        imageUrl: 'image1.jpg',
        audioUrl: 'audio1.mp3'
      },
      { 
        _id: 'song2', 
        title: 'Test Song 2', 
        artist: 'Test Artist 2',
        imageUrl: 'image2.jpg',
        audioUrl: 'audio2.mp3'
      }
    ];
    
    it('should return trending songs with specific fields', async () => {      
      // Setup mock implementation
      mockSongModel.aggregate.mockResolvedValue(projectedSongs);
      
      // Call the controller function
      await getTrendingSongs(req, res, next);

      // Check if the response was as expected
      expect(mockSongModel.aggregate).toHaveBeenCalledWith([
        { $sample: { size: 4 } },
        { 
          $project: {
            _id: 1,
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1
          }
        }
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(projectedSongs);
    });

    it('should call next with error if an exception occurs', async () => {
      // Simulate a database error
      const testError = new Error('Database error');
      mockSongModel.aggregate.mockRejectedValue(testError);

      // Call the controller function
      await getTrendingSongs(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });
});
