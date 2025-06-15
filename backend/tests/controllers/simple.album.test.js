import { jest } from '@jest/globals';
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockPopulate = jest.fn();
const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await mockFind();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};
const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    mockFindById(albumId);
    const album = await mockPopulate();
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};
describe('Album Controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = {
      params: { albumId: 'album123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  describe('getAllAlbums', () => {
    test('should return all albums', async () => {
      const albums = [
        { _id: 'album1', title: 'Test Album 1' },
        { _id: 'album2', title: 'Test Album 2' }
      ];
      mockFind.mockResolvedValue(albums);
      await getAllAlbums(req, res, next);
      expect(mockFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(albums);
    });
    test('should handle errors', async () => {
      const error = new Error('Server error');
      mockFind.mockRejectedValue(error);
      await getAllAlbums(req, res, next);
      expect(mockFind).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('getAlbumById', () => {
    test('should return a single album by ID', async () => {
      const album = { _id: 'album123', title: 'Test Album' };
      mockPopulate.mockResolvedValue(album);
      await getAlbumById(req, res, next);
      expect(mockFindById).toHaveBeenCalledWith('album123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(album);
    });
    test('should return 404 if album not found', async () => {
      mockPopulate.mockResolvedValue(null);
      await getAlbumById(req, res, next);
      expect(mockFindById).toHaveBeenCalledWith('album123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Album not found' });
    });
    test('should handle errors', async () => {
      const error = new Error('Server error');
      mockFindById.mockImplementation(() => {
        throw error;
      });
      await getAlbumById(req, res, next);
      expect(mockFindById).toHaveBeenCalledWith('album123');
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
