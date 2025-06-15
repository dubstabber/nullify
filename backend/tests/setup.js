import { jest } from "@jest/globals";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { mockSongModel, mockUserModel, mockAlbumModel } from "./mocks.js";
dotenv.config();
// Set longer timeout for tests
jest.setTimeout(30000);
process.env.JWT_SECRET = "test-jwt-secret";
process.env.NODE_ENV = "test";
// Export mock models for use in tests
export { mockSongModel, mockUserModel, mockAlbumModel };
