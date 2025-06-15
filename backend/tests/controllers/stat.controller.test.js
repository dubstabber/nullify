import { jest } from '@jest/globals';
const mockSongCountDocuments = jest.fn();
const mockAlbumCountDocuments = jest.fn();
const mockUserCountDocuments = jest.fn();
const mockSongAggregate = jest.fn();
const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
      mockSongCountDocuments(),
      mockAlbumCountDocuments(),
      mockUserCountDocuments(),
      mockSongAggregate([
        {
          $group: {
            _id: "$artist"
          }
        },
        {
          $count: "count"
        }
      ])
    ]);
    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0
    });
  } catch (error) {
    next(error);
  }
};
describe('Stats Controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  it('should return stats with all counts', async () => {
    mockSongCountDocuments.mockResolvedValue(2);
    mockAlbumCountDocuments.mockResolvedValue(2);
    mockUserCountDocuments.mockResolvedValue(2);
    mockSongAggregate.mockResolvedValue([{ count: 3 }]);
    await getStats(req, res, next);
    expect(mockSongCountDocuments).toHaveBeenCalled();
    expect(mockUserCountDocuments).toHaveBeenCalled();
    expect(mockAlbumCountDocuments).toHaveBeenCalled();
    expect(mockSongAggregate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalSongs: 2,
      totalUsers: 2,
      totalAlbums: 2,
      totalArtists: 3
    });
    expect(next).not.toHaveBeenCalled();
  });
  it('should return 0 for totalArtists if none are found', async () => {
    mockSongCountDocuments.mockResolvedValue(2);
    mockAlbumCountDocuments.mockResolvedValue(2);
    mockUserCountDocuments.mockResolvedValue(2);
    mockSongAggregate.mockResolvedValue([]);
    await getStats(req, res, next);
    expect(mockSongCountDocuments).toHaveBeenCalled();
    expect(mockUserCountDocuments).toHaveBeenCalled();
    expect(mockAlbumCountDocuments).toHaveBeenCalled();
    expect(mockSongAggregate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalSongs: 2,
      totalUsers: 2,
      totalAlbums: 2,
      totalArtists: 0
    });
    expect(next).not.toHaveBeenCalled();
  });
  it('should call next with error if an exception occurs', async () => {
    const testError = new Error('Database error');
    mockSongCountDocuments.mockRejectedValue(testError);
    await getStats(req, res, next);
    expect(next).toHaveBeenCalledWith(testError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
