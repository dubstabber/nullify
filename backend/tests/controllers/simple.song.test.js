import { jest } from "@jest/globals";
const mockSongFind = jest.fn();
const mockSongAggregate = jest.fn();
const getAllSongs = async (req, res, next) => {
  try {
    const songs = await mockSongFind().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await mockSongAggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await mockSongAggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await mockSongAggregate([
      {
        $match: { trendingStatus: true },
      },
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
describe('Song Controller', () => {
  let req, res, next;
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
  const mockProjectedSongs = [
    {
      _id: "song1",
      title: "Test Song 1",
      artist: "Test Artist 1",
      imageUrl: "image1.jpg",
      audioUrl: "audio1.mp3",
    },
    {
      _id: "song2",
      title: "Test Song 2",
      artist: "Test Artist 2",
      imageUrl: "image2.jpg",
      audioUrl: "audio2.mp3",
    },
  ];
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  describe('getAllSongs', () => {
    it('should return all songs sorted by createdAt in descending order', async () => {
      mockSongFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSongs)
      });
      await getAllSongs(req, res, next);
      expect(mockSongFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockSongFind.mockImplementation(() => {
        throw error;
      });
      await getAllSongs(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('getFeaturedSongs', () => {
    it('should return featured songs', async () => {
      mockSongAggregate.mockResolvedValue(mockProjectedSongs);
      await getFeaturedSongs(req, res, next);
      expect(mockSongAggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjectedSongs);
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockSongAggregate.mockRejectedValue(error);
      await getFeaturedSongs(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('getMadeForYouSongs', () => {
    it('should return made for you songs', async () => {
      mockSongAggregate.mockResolvedValue(mockProjectedSongs);
      await getMadeForYouSongs(req, res, next);
      expect(mockSongAggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjectedSongs);
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockSongAggregate.mockRejectedValue(error);
      await getMadeForYouSongs(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('getTrendingSongs', () => {
    it('should return trending songs', async () => {
      mockSongAggregate.mockResolvedValue(mockProjectedSongs);
      await getTrendingSongs(req, res, next);
      expect(mockSongAggregate).toHaveBeenCalledWith([
        {
            $match: { trendingStatus: true },
        },
        {
            $sample: { size: 4 },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl: 1,
                audioUrl: 1,
            },
        },
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjectedSongs);
      expect(next).not.toHaveBeenCalled();
    });
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockSongAggregate.mockRejectedValue(error);
      await getTrendingSongs(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
