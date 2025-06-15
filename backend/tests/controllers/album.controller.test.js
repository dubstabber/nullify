import { jest } from "@jest/globals";
import {
  getAllAlbums,
  getAlbumById,
} from "../../src/controller/album.controller.js";
import { mockAlbumModel } from "../mocks.js";

// Mock the Album model
jest.mock('../../src/models/album.model', () => ({
  __esModule: true,
  Album: mockAlbumModel
}));

describe("Album Controller", () => {
  let req;
  let res;
  let next;
  const mockAlbum = {
    _id: "album1",
    title: "Test Album",
    artist: "Test Artist",
    imageUrl: "image1.jpg",
    songs: [
      {
        _id: "song1",
        title: "Test Song 1",
        artist: "Test Artist",
        audioUrl: "audio1.mp3",
        imageUrl: "image1.jpg",
      },
    ],
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getAllAlbums", () => {
    it("should return all albums", async () => {
      // Setup mock implementation
      mockAlbumModel.find.mockResolvedValue([mockAlbum]);

      // Call the controller function
      await getAllAlbums(req, res, next);

      // Verify the response
      expect(mockAlbumModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockAlbum]);
    });

    it("should call next with error if an exception occurs", async () => {
      // Simulate a database error
      const testError = new Error("Database error");
      mockAlbumModel.find.mockRejectedValue(testError);

      // Call the controller function
      await getAllAlbums(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });

  describe("getAlbumById", () => {
    it("should return album by id with populated songs", async () => {
      // Setup request params
      req.params = { albumId: "album1" };

      // Setup mock implementation
      mockAlbumModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAlbum)
      });

      // Call the controller function
      await getAlbumById(req, res, next);

      // Verify the response
      expect(mockAlbumModel.findById).toHaveBeenCalledWith("album1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAlbum);
    });

    it("should return 404 if album not found", async () => {
      // Setup request params
      req.params = { albumId: "nonexistent" };

      // Setup mock implementation
      mockAlbumModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      // Call the controller function
      await getAlbumById(req, res, next);

      // Verify the response
      expect(mockAlbumModel.findById).toHaveBeenCalledWith("nonexistent");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Album not found" });
    });

    it("should call next with error if an exception occurs", async () => {
      // Setup request params
      req.params = { albumId: "album1" };

      // Simulate a database error
      const testError = new Error("Database error");
      mockAlbumModel.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(testError)
      });

      // Call the controller function
      await getAlbumById(req, res, next);

      // Check if the error was passed to next()
      expect(next).toHaveBeenCalledWith(testError);
    });
  });
});
