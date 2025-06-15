console.log("Running jest.setup.js");
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { mockSongModel, mockAlbumModel, mockUserModel } from "./mocks.js";
jest.mock("../src/models/song.model.js", () => ({
  __esModule: true,
  Song: mockSongModel,
}));
jest.mock("../src/models/album.model.js", () => ({
  __esModule: true,
  Album: mockAlbumModel,
}));
jest.mock("../src/models/user.model.js", () => ({
  __esModule: true,
  User: mockUserModel,
}));
jest.mock("../src/lib/cloudinary.js", () => {
  const cloudinary = {
    config: jest.fn(),
    uploader: {
      upload: jest
        .fn()
        .mockResolvedValue({ secure_url: "https://example.com//example.com/test.jpg" }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  };
  return {
    __esModule: true,
    default: cloudinary,
    uploadToCloudinary: jest.fn().mockResolvedValue({
      secure_url: "https://example.com//example.com/test.jpg",
      public_id: "test-public-id",
    }),
    deleteFromCloudinary: jest.fn().mockResolvedValue({ result: "ok" }),
  };
});
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: "https://example.com//test-cloudinary-url.com/image.jpg",
        public_id: "test-public-id",
      }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));
jest.mock("mongoose", () => {
  const originalModule = jest.requireActual("mongoose");
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    connection: {
      close: jest.fn().mockResolvedValue(undefined),
      readyState: 1,
      on: jest.fn(),
    },
  };
});
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
beforeEach(() => {
  jest.clearAllMocks();
  mockSongModel.clearTestData();
  mockAlbumModel.clearTestData();
  mockUserModel.clearTestData();
  mockSongModel.resetMocks();
  mockAlbumModel.resetMocks();
  mockUserModel.resetMocks();
});
afterAll(async () => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
});
export { mockSongModel, mockUserModel, mockAlbumModel };
