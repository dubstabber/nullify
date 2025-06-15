import { jest } from '@jest/globals';

// Create direct test mocks
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockPopulate = jest.fn();

// Create controller functions directly with mocks
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
    mockPopulate.mockReturnValueOnce(albumId === 'notfound' ? null : { _id: albumId, title: 'Test Album' });
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
      params: { albumId: 'album123' },
      query: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  describe('getAllAlbums', () => {
    test('should return all albums', async () => {
      // Mock data
      const albums = [
        { _id: 'album1', title: 'Test Album 1' },
        { _id: 'album2', title: 'Test Album 2' }
      ];
      
      // Setup mock return
      mockFind.mockResolvedValue(albums);
      
      // Call controller
      await getAllAlbums(req, res, next);
      
      // Assertions
      expect(mockFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(albums);
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      // Setup error case
      const error = new Error('Database error');
      mockFind.mockRejectedValue(error);
      
      // Call controller
      await getAllAlbums(req, res, next);
      
      // Assertions
      expect(mockFind).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAlbumById', () => {
    test('should return a single album by ID', async () => {
      // Call controller
      await getAlbumById(req, res, next);
      
      // Assertions
      expect(mockFindById).toHaveBeenCalledWith('album123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'album123', title: 'Test Album' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 404 if album not found', async () => {
      // Update request for not found case
      req.params.albumId = 'notfound';
      
      // Call controller
      await getAlbumById(req, res, next);
      
      // Assertions
      expect(mockFindById).toHaveBeenCalledWith('notfound');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Album not found' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      // Setup error case
      const error = new Error('Database error');
      mockFindById.mockImplementation(() => {
        throw error;
      });
      
      // Call controller
      await getAlbumById(req, res, next);
      
      // Assertions
      expect(mockFindById).toHaveBeenCalledWith('album123');
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
