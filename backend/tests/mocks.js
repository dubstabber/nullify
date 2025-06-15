import { jest } from '@jest/globals';

// Create a MockModel constructor
class MockModel {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    this.mockData = [];
    
    // Create a query builder
    const createQueryBuilder = () => ({
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(this.mockData)
    });

    // Basic CRUD operations
    this.find = jest.fn().mockReturnValue(createQueryBuilder());
    this.findById = jest.fn().mockReturnValue(createQueryBuilder());
    this.findOne = jest.fn().mockReturnValue(createQueryBuilder());
    this.create = jest.fn().mockImplementation((data) => {
      const newItem = { ...data, _id: Math.random().toString(36).substr(2, 9) };
      this.mockData.push(newItem);
      return Promise.resolve(newItem);
    });
    this.findByIdAndUpdate = jest.fn().mockReturnValue(createQueryBuilder());
    this.findByIdAndDelete = jest.fn().mockReturnValue(createQueryBuilder());
    
    // Aggregation operations
    this.aggregate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([])
    });
    
    // Count operations
    this.countDocuments = jest.fn().mockReturnThis();
    
    // Update operations
    this.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 0 });
    
    // Delete operations
    this.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

    this.exec = jest.fn().mockResolvedValue(0);
  }

  // Helper methods
  addTestData(data) {
    if (Array.isArray(data)) {
      this.mockData.push(...data);
    } else {
      this.mockData.push(data);
    }
  }

  clearTestData() {
    this.mockData = [];
  }

  resetMocks() {
    this.mockData = [];
    this.countDocuments.mockClear();
    this.aggregate.mockClear();
    this.exec.mockClear();
    this.find.mockClear();
    this.findById.mockClear();
    this.findOne.mockClear();
    this.create.mockClear();
    this.findByIdAndUpdate.mockClear();
    this.findByIdAndDelete.mockClear();
  }
}

// Create mock models
const createMockModel = () => new MockModel('mock', {});

export const mockSongModel = createMockModel();
export const mockAlbumModel = createMockModel();
export const mockUserModel = createMockModel();

// Export all mocks
export default {
  mockSongModel,
  mockAlbumModel,
  mockUserModel
}; 