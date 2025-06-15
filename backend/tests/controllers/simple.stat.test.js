import { jest } from '@jest/globals';
import { getStats } from '../../src/controller/stat.controller.js';
import { mockSongModel, mockUserModel, mockAlbumModel } from '../mocks.js';

// Add a default timeout for all tests in this file
jest.setTimeout(15000);

// Mock the models
jest.mock('../../src/models/song.model.js', () => ({
  Song: mockSongModel
}));

jest.mock('../../src/models/user.model.js', () => ({
  User: mockUserModel
}));

jest.mock('../../src/models/album.model.js', () => ({
  Album: mockAlbumModel
}));

describe('Stats Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    mockSongModel.clearTestData();
    mockUserModel.clearTestData();
    mockAlbumModel.clearTestData();
    mockSongModel.resetMocks();
    mockUserModel.resetMocks();
    mockAlbumModel.resetMocks();
  });

  it('should return stats with all counts', async () => {
    const mockSongs = [
      { _id: '1', title: 'Song 1' },
      { _id: '2', title: 'Song 2' }
    ];
    const mockUsers = [
      { _id: '1', username: 'User 1' },
      { _id: '2', username: 'User 2' }
    ];
    const mockAlbums = [
      { _id: '1', title: 'Album 1' },
      { _id: '2', title: 'Album 2' }
    ];

    mockSongModel.addTestData(mockSongs);
    mockUserModel.addTestData(mockUsers);
    mockAlbumModel.addTestData(mockAlbums);

    mockSongModel.countDocuments.mockResolvedValueOnce(2);
    mockUserModel.countDocuments.mockResolvedValueOnce(2);
    mockAlbumModel.countDocuments.mockResolvedValueOnce(2);
    mockSongModel.aggregate.mockResolvedValueOnce([]);

    await getStats(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalSongs: 2,
      totalUsers: 2,
      totalAlbums: 2,
      totalArtists: 0
    });
  });

  it('should return 0 for totalArtists if none are found', async () => {
    const mockSongs = [
      { _id: '1', title: 'Song 1' },
      { _id: '2', title: 'Song 2' }
    ];
    const mockUsers = [
      { _id: '1', username: 'User 1' },
      { _id: '2', username: 'User 2' }
    ];
    const mockAlbums = [
      { _id: '1', title: 'Album 1' },
      { _id: '2', title: 'Album 2' }
    ];

    mockSongModel.addTestData(mockSongs);
    mockUserModel.addTestData(mockUsers);
    mockAlbumModel.addTestData(mockAlbums);

    await getStats(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalSongs: 2,
      totalUsers: 2,
      totalAlbums: 2,
      totalArtists: 0
    });
  });

  it('should call next with error if an exception occurs', async () => {
    const testError = new Error('Operation `songs.aggregate()` buffering timed out after 10000ms');
    mockSongModel.aggregate.mockRejectedValueOnce(testError);

    await getStats(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });
});
