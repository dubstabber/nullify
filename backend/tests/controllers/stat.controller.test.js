import { jest } from '@jest/globals';
import { getStats } from '../../src/controller/stat.controller.js';
import { mockSongModel, mockUserModel, mockAlbumModel } from '../setup.js';

// Add a default timeout for all tests in this file
jest.setTimeout(15000);

describe('Stats Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should return stats with all counts', async () => {
    await getStats(req, res, next);

    expect(mockSongModel.countDocuments).toHaveBeenCalled();
    expect(mockUserModel.countDocuments).toHaveBeenCalled();
    expect(mockAlbumModel.countDocuments).toHaveBeenCalled();
    expect(mockSongModel.aggregate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalSongs: 2,
      totalUsers: 2,
      totalAlbums: 2,
      totalArtists: 0
    });
  });

  it('should return 0 for totalArtists if none are found', async () => {
    await getStats(req, res, next);

    expect(mockSongModel.countDocuments).toHaveBeenCalled();
    expect(mockUserModel.countDocuments).toHaveBeenCalled();
    expect(mockAlbumModel.countDocuments).toHaveBeenCalled();
    expect(mockSongModel.aggregate).toHaveBeenCalled();
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
    mockSongModel.exec.mockRejectedValue(testError);

    await getStats(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
