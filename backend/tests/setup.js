import { jest } from "@jest/globals";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { mockSongModel, mockUserModel, mockAlbumModel } from './mocks.js';

dotenv.config();

// Set longer timeout for tests
jest.setTimeout(30000);

process.env.JWT_SECRET = "test-jwt-secret";
process.env.NODE_ENV = "test";

// Mock mongoose and other dependencies
jest.mock("mongoose", () => {
  const mockObjectId = function (id) {
    return id || "mock-id";
  };
  mockObjectId.isValid = jest.fn().mockReturnValue(true);

  // Create a proper Schema constructor
  function MockSchema(obj) {
    this.obj = obj;
    this.path = jest.fn();
    this.virtual = jest.fn().mockReturnThis();
    this.pre = jest.fn().mockReturnThis();
    this.post = jest.fn().mockReturnThis();
    this.methods = {};
    this.statics = {};
  }

  MockSchema.Types = {
    ObjectId: mockObjectId,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Array: Array,
    Date: Date,
    Map: Map,
  };

  // Create a mock model constructor
  function MockModel(name, schema) {
    this.name = name;
    this.schema = schema;

    // Create a query builder that properly chains methods
    const createQueryBuilder = () => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      lean: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
    });

    this.find = jest.fn().mockReturnValue(createQueryBuilder());
    this.findById = jest.fn().mockImplementation((id) => {
      return createQueryBuilder().exec.mockResolvedValue(mockAlbum);
    });
    this.findOne = jest.fn().mockReturnValue(createQueryBuilder());
    this.findByIdAndUpdate = jest.fn().mockReturnValue(createQueryBuilder());
    this.findByIdAndDelete = jest.fn().mockReturnValue(createQueryBuilder());

    // Make aggregate return a promise directly
    this.aggregate = jest.fn().mockResolvedValue([]);
    this.create = jest.fn().mockResolvedValue({});
    this.countDocuments = jest.fn().mockResolvedValue(25);
  }

  // Export MockModel for use in other test files
  global.MockModel = MockModel;

  return {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      readyState: 1, // Set to connected state
      close: jest.fn().mockResolvedValue(true),
      on: jest.fn(),
    },
    Schema: MockSchema,
    model: jest.fn((name, schema) => new MockModel(name, schema)),
    Types: {
      ObjectId: mockObjectId,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Array: Array,
      Date: Date,
      Map: Map,
    },
  };
});

// Mock cloudinary
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: "https://test-cloudinary-url.com/image.jpg",
        public_id: "test-public-id",
      }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

// Mock our cloudinary library
jest.mock("../src/lib/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    secure_url: "https://test-cloudinary-url.com/image.jpg",
    public_id: "test-public-id",
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({ result: "ok" }),
}));

// Create mock models
const mockSongModel = {
  countDocuments: jest.fn().mockReturnThis(),
  aggregate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(2)
};

const mockUserModel = {
  countDocuments: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(2)
};

const mockAlbumModel = {
  countDocuments: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(2)
};

// Mock all models in one place
jest.mock('../src/models/song.model.js', () => ({
  Song: mockSongModel
}));

jest.mock('../src/models/user.model.js', () => ({
  User: mockUserModel
}));

jest.mock('../src/models/album.model.js', () => ({
  Album: mockAlbumModel
}));

// Global setup
beforeAll(async () => {
  // Set mongoose connection to connected state
  mongoose.connection.readyState = 1;
});

// Global teardown
afterAll(async () => {
  // Reset mongoose connection state
  mongoose.connection.readyState = 0;
});

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  mockSongModel.resetMocks();
  mockUserModel.resetMocks();
  mockAlbumModel.resetMocks();
  mockSongModel.clearTestData();
  mockUserModel.clearTestData();
  mockAlbumModel.clearTestData();
});

// Silence console during tests
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();

// Export mock models for use in tests
export { mockSongModel, mockUserModel, mockAlbumModel };
