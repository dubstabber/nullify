import { jest } from "@jest/globals";
const mockAlbumFind = jest.fn();
const mockAlbumFindById = jest.fn();
const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await mockAlbumFind();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};
const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await mockAlbumFindById(albumId).populate({
      path: "songs",
      select: "title artist imageUrl audioUrl",
    });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};
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
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  describe("getAllAlbums", () => {
    it("should return all albums", async () => {
      mockAlbumFind.mockResolvedValue([mockAlbum]);
      await getAllAlbums(req, res, next);
      expect(mockAlbumFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockAlbum]);
      expect(next).not.toHaveBeenCalled();
    });
    it("should call next with error if an exception occurs", async () => {
      const testError = new Error("Database error");
      mockAlbumFind.mockRejectedValue(testError);
      await getAllAlbums(req, res, next);
      expect(next).toHaveBeenCalledWith(testError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe("getAlbumById", () => {
    it("should return album by id with populated songs", async () => {
      req.params = { albumId: "album1" };
      mockAlbumFindById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAlbum)
      });
      await getAlbumById(req, res, next);
      expect(mockAlbumFindById).toHaveBeenCalledWith("album1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAlbum);
      expect(next).not.toHaveBeenCalled();
    });
    it("should return 404 if album not found", async () => {
      req.params = { albumId: "nonexistent" };
      mockAlbumFindById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      await getAlbumById(req, res, next);
      expect(mockAlbumFindById).toHaveBeenCalledWith("nonexistent");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Album not found" });
      expect(next).not.toHaveBeenCalled();
    });
    it("should call next with error if an exception occurs", async () => {
      req.params = { albumId: "album1" };
      const testError = new Error("Database error");
      mockAlbumFindById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(testError)
      });
      await getAlbumById(req, res, next);
      expect(next).toHaveBeenCalledWith(testError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
