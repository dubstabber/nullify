import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { mockSongModel } from "../setup.js";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
} from "../../src/controller/song.controller.js";

// Add a default timeout for all tests in this file
jest.setTimeout(15000);

// Mock the Song model
jest.mock('../../src/models/song.model.js', () => ({
  Song: mockSongModel
}));

describe("Song Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockSongModel.clearTestData();
    mockSongModel.resetMocks();
  });

  describe("getAllSongs", () => {
    it("should return all songs sorted by createdAt in descending order", async () => {
      const mockSongs = [
        { _id: "1", title: "Song 1", createdAt: new Date("2023-01-01") },
        { _id: "2", title: "Song 2", createdAt: new Date("2023-01-02") },
      ];
      mockSongModel.addTestData(mockSongs);

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSongs),
      };
      mockSongModel.find.mockReturnValue(mockQuery);

      await getAllSongs(req, res, next);

      expect(mockSongModel.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      mockSongModel.find.mockImplementationOnce(() => {
        throw error;
      });

      await getAllSongs(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getFeaturedSongs", () => {
    it("should return featured songs", async () => {
      const mockSongs = [
        { _id: "1", title: "Featured Song 1" },
        { _id: "2", title: "Featured Song 2" },
      ];
      mockSongModel.addTestData(mockSongs);
      mockSongModel.aggregate.mockResolvedValueOnce(mockSongs);

      await getFeaturedSongs(req, res, next);

      expect(mockSongModel.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      mockSongModel.aggregate.mockRejectedValueOnce(error);

      await getFeaturedSongs(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getMadeForYouSongs", () => {
    it("should return made for you songs", async () => {
      const mockSongs = [
        { _id: "1", title: "Made for You Song 1" },
        { _id: "2", title: "Made for You Song 2" },
      ];
      mockSongModel.addTestData(mockSongs);
      mockSongModel.aggregate.mockResolvedValueOnce(mockSongs);

      await getMadeForYouSongs(req, res, next);

      expect(mockSongModel.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      mockSongModel.aggregate.mockRejectedValueOnce(error);

      await getMadeForYouSongs(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getTrendingSongs", () => {
    it("should return trending songs", async () => {
      const mockSongs = [
        { _id: "1", title: "Trending Song 1", trendingStatus: true },
        { _id: "2", title: "Trending Song 2", trendingStatus: true },
      ];
      mockSongModel.addTestData(mockSongs);

      // Setup mock implementation
      mockSongModel.aggregate.mockImplementation(() => Promise.resolve(mockSongs));

      await getTrendingSongs(req, res, next);

      // Verify mock was called with expected arguments
      expect(mockSongModel.aggregate).toHaveBeenCalledWith([
        {
            $match: { trendingStatus: true },
        },
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            artist: 1,
            imageUrl: 1,
            audioUrl: 1,
          },
        },
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSongs);
    });

    it("should handle errors", async () => {
      const error = new Error(
        "MongooseError: Operation `songs.aggregate()` buffering timed out after 10000ms"
      );
      mockSongModel.aggregate.mockRejectedValueOnce(error);

      await getTrendingSongs(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(mongoose.Error));
    });
  });
});
