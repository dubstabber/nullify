import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { mockSongModel, mockAlbumModel, mockUserModel } from "./mocks.js";

// Mock all models consistently
jest.mock("../src/models/song.model.js", () => ({
  __esModule: true,
  default: mockSongModel,
  Song: mockSongModel,
}));

jest.mock("../src/models/album.model.js", () => ({
  __esModule: true,
  Album: mockAlbumModel,
}));

jest.mock("../src/models/user.model.js", () => ({
  __esModule: true,
  default: mockUserModel,
  User: mockUserModel,
}));

// Mock cloudinary
jest.mock("../src/lib/cloudinary", () => {
  const cloudinary = {
    config: jest.fn(),
    uploader: {
      upload: jest
        .fn()
        .mockResolvedValue({ secure_url: "https://example.com/test.jpg" }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  };
  return {
    __esModule: true,
    default: cloudinary,
  };
});

// Mock mongoose
jest.mock("mongoose", () => {
  const originalModule = jest.requireActual("mongoose");
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    connection: {
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock express
jest.mock("express", () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  json: jest.fn(),
  urlencoded: jest.fn(),
}));

// Reset all mocks and test data before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockSongModel.clearTestData();
  mockAlbumModel.clearTestData();
  mockUserModel.clearTestData();
  mockSongModel.resetMocks();
  mockAlbumModel.resetMocks();
  mockUserModel.resetMocks();
});

// Global teardown
afterAll(async () => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});

// Export mock models for use in tests
export { mockSongModel, mockUserModel, mockAlbumModel };
