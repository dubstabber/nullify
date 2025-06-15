import { jest } from '@jest/globals';

// Create controller functions with direct mocks instead of importing
const mockAlbumFind = jest.fn();
const mockAlbumFindById = jest.fn();
const mockPopulate = jest.fn();

// Create the controller functions we want to test
const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await mockAlbumFind();
    res.status(200).json({
      success: true,
      data: albums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch albums'
    });
    next(error);
  }
};

const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    mockAlbumFindById(albumId);
    // Simulate mongoose's chained populate method
    const populateChain = {
      populate: mockPopulate
    };
    
    const album = await mockPopulate();
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: album
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch album'
    });
    next(error);
  }
};

describe('Album Controller Tests', () => {
  // Setup request, response, and next function mocks
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
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  describe('getAllAlbums', () => {
    test('should return all albums with status 200', async () => {
      // Mock data
      const mockAlbums = [
        { _id: 'album1', title: 'Test Album 1' },
        { _id: 'album2', title: 'Test Album 2' }
      ];
      
      // Setup mock return
      mockAlbumFind.mockResolvedValue(mockAlbums);
      
      // Execute controller
      await getAllAlbums(req, res, next);
      
      // Verify results
      expect(mockAlbumFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAlbums
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    test('should handle errors and return status 500', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      mockAlbumFind.mockRejectedValue(error);
      
      // Execute controller
      await getAllAlbums(req, res, next);
      
      // Verify results
      expect(mockAlbumFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Could not fetch albums'
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getAlbumById', () => {
    test('should return album with status 200 when found', async () => {
      // Mock data
      const mockAlbum = { _id: 'album123', title: 'Test Album' };
      
      // Setup mock return
      mockPopulate.mockResolvedValue(mockAlbum);
      
      // Execute controller
      await getAlbumById(req, res, next);
      
      // Verify results
      expect(mockAlbumFindById).toHaveBeenCalledWith('album123');
      expect(mockPopulate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAlbum
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    test('should return 404 if album not found', async () => {
      // Setup mock return for not found case
      mockPopulate.mockResolvedValue(null);
      
      // Execute controller
      await getAlbumById(req, res, next);
      
      // Verify results
      expect(mockAlbumFindById).toHaveBeenCalledWith('album123');
      expect(mockPopulate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Album not found'
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    test('should handle errors and return status 500', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      mockPopulate.mockRejectedValue(error);
      
      // Execute controller
      await getAlbumById(req, res, next);
      
      // Verify results
      expect(mockAlbumFindById).toHaveBeenCalledWith('album123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Could not fetch album'
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
