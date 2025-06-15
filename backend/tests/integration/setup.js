import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import express from 'express';
import supertest from 'supertest';
import cors from 'cors';
import { mockSongModel, mockUserModel, mockAlbumModel } from '../mocks.js';
import request from 'supertest';
// Mock middleware
const mockAuthMiddleware = (req, res, next) => {
  // For testing purposes, we'll make all requests pass through auth
  req.userId = 'test-user-id';
  req.isAdmin = true;
  next();
};
// Mock file middleware
const mockFileMiddleware = (req, res, next) => {
  // Simulate file uploads for testing
  req.files = req.files || {};
  next();
};
// Mock cloudinary
jest.mock('../../src/lib/cloudinary', () => {
  const cloudinary = {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: 'https://example.com/test.jpg' }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  };
  return {
    __esModule: true,
    default: cloudinary
  };
});
// Mock models
jest.mock('../../src/models/song.model', () => ({
  __esModule: true,
  default: mockSongModel,
  Song: mockSongModel
}));
jest.mock('../../src/models/album.model', () => ({
  __esModule: true,
  Album: mockAlbumModel
}));
jest.mock('../../src/models/user.model', () => ({
  __esModule: true,
  default: mockUserModel,
  User: mockUserModel
}));
// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    close: jest.fn().mockResolvedValue({})
  }
}));
export const setupTestDB = async () => {
  // No need for actual DB connection since we're using mocks
  jest.clearAllMocks();
};
export const closeTestDB = async () => {
  // No need for actual DB connection since we're using mocks
  jest.clearAllMocks();
};
export const clearDatabase = async () => {
  // No need for actual DB operations since we're using mocks
  jest.clearAllMocks();
};
// Setup test app
export const setupTestApp = (router) => {
  const app = express();
  // Apply middlewares
  app.use(cors());
  app.use(express.json());
  app.use(mockAuthMiddleware);
  app.use(mockFileMiddleware);
  // Apply router at root level
  app.use(router);
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error in error handler:", err);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    // Handle invalid ObjectId errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }
    // Handle custom errors with status codes
    if (err.status) {
      return res.status(err.status).json({
        message: err.message
      });
    }
    // Handle other errors
    res.status(500).json({
      message: err.message || 'Internal server error'
    });
  });
  return app;
};
export const createTestAgent = (app) => {
  return request(app);
};
// For testing purposes, disable console output
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();
