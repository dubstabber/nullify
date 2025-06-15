import { jest } from "@jest/globals";
class MockModel {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    this.mockData = [];
    const createQueryBuilder = () => ({
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockImplementation(() => {
        console.log(`QueryBuilder.exec called for ${this.name}`);
        return Promise.resolve(this.mockData);
      }),
    });
    this.find = jest.fn().mockImplementation((query = {}) => {
      console.log(`MockModel.find called for ${this.name}`);
      const queryBuilder = createQueryBuilder();
      queryBuilder.sort = jest.fn().mockImplementation(() => {
        queryBuilder.exec = jest.fn().mockResolvedValue(this.mockData);
        return queryBuilder;
      });
      return queryBuilder;
    });
    this.findById = jest.fn().mockImplementation((id) => {
      const queryBuilder = createQueryBuilder();
      queryBuilder.exec = jest.fn().mockResolvedValue(
        this.mockData.find(item => item._id === id) || null
      );
      return queryBuilder;
    });
    this.findOne = jest.fn().mockImplementation((query) => {
      const queryBuilder = createQueryBuilder();
      queryBuilder.exec = jest.fn().mockResolvedValue(this.mockData[0] || null);
      return queryBuilder;
    });
    this.create = jest.fn().mockImplementation((data) => {
      const newItem = { ...data, _id: Math.random().toString(36).substr(2, 9) };
      this.mockData.push(newItem);
      return Promise.resolve(newItem);
    });
    this.findByIdAndUpdate = jest.fn().mockImplementation((id, update) => {
      const queryBuilder = createQueryBuilder();
      const item = this.mockData.find(item => item._id === id);
      if (item) {
        Object.assign(item, update);
      }
      queryBuilder.exec = jest.fn().mockResolvedValue(item || null);
      return queryBuilder;
    });
    this.findByIdAndDelete = jest.fn().mockImplementation((id) => {
      const queryBuilder = createQueryBuilder();
      const index = this.mockData.findIndex(item => item._id === id);
      const item = index >= 0 ? this.mockData.splice(index, 1)[0] : null;
      queryBuilder.exec = jest.fn().mockResolvedValue(item);
      return queryBuilder;
    });
    this.aggregate = jest.fn().mockImplementation((pipeline) => {
      console.log(`MockModel.aggregate called for ${this.name} with:`, pipeline);
      let result = [];
      if (pipeline && pipeline.length > 0) {
        const sampleStage = pipeline.find(stage => stage.$sample);
        if (sampleStage) {
          const sampleSize = sampleStage.$sample.size;
          result = this.mockData.slice(0, Math.min(sampleSize, this.mockData.length));
        } else {
          result = this.mockData;
        }
        const projectStage = pipeline.find(stage => stage.$project);
        if (projectStage && result.length > 0) {
          const projection = projectStage.$project;
          result = result.map(item => {
            const projected = {};
            Object.keys(projection).forEach(key => {
              if (projection[key] === 1 && item[key] !== undefined) {
                projected[key] = item[key];
              }
            });
            return projected;
          });
        }
      } else {
        result = this.mockData;
      }
      return Promise.resolve(result);
    });
    this.countDocuments = jest.fn().mockImplementation((query = {}) => {
      console.log(`MockModel.countDocuments called for ${this.name}`);
      return Promise.resolve(this.mockData.length);
    });
    this.updateMany = jest.fn().mockResolvedValue({ 
      modifiedCount: this.mockData.length,
      matchedCount: this.mockData.length 
    });
    this.deleteMany = jest.fn().mockImplementation((query = {}) => {
      const count = this.mockData.length;
      this.mockData = [];
      return Promise.resolve({ deletedCount: count });
    });
    this.exec = jest.fn().mockImplementation(() => {
      console.log(`MockModel.exec called for ${this.name}`);
      return Promise.resolve(this.mockData.length);
    });
  }
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
    this.countDocuments.mockClear();
    this.aggregate.mockClear();
    this.exec.mockClear();
    this.find.mockClear();
    this.findById.mockClear();
    this.findOne.mockClear();
    this.create.mockClear();
    this.findByIdAndUpdate.mockClear();
    this.findByIdAndDelete.mockClear();
    this.updateMany.mockClear();
    this.deleteMany.mockClear();
  }
}
const createMockModel = (name) => {
  const model = new MockModel(name, {});
  if (name === 'Song') {
    model.addTestData([
      {
        _id: "song1",
        title: "Test Song 1",
        artist: "Test Artist 1",
        albumId: "album1",
        imageUrl: "image1.jpg",
        audioUrl: "audio1.mp3",
        duration: 180,
        createdAt: "2023-01-01",
        updatedAt: "2023-01-02",
      },
      {
        _id: "song2",
        title: "Test Song 2",
        artist: "Test Artist 2",
        albumId: "album2",
        imageUrl: "image2.jpg",
        audioUrl: "audio2.mp3",
        duration: 240,
        createdAt: "2023-02-01",
        updatedAt: "2023-02-02",
      },
    ]);
  }
  return model;
};
export const mockSongModel = createMockModel('Song');
export const mockAlbumModel = createMockModel('Album');
export const mockUserModel = createMockModel('User');
export default {
  mockSongModel,
  mockAlbumModel,
  mockUserModel,
};
