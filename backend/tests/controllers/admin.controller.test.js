import { jest } from '@jest/globals';
const mockSongFindById = jest.fn();
const mockSongFindByIdAndDelete = jest.fn();
const mockSongDeleteMany = jest.fn();
const mockSongSave = jest.fn();
const mockAlbumFindByIdAndUpdate = jest.fn();
const mockAlbumFindByIdAndDelete = jest.fn();
const mockAlbumSave = jest.fn();
const mockCloudinaryUpload = jest.fn();
const MockSong = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: 'mock-song-id',
  save: mockSongSave.mockResolvedValue({
    ...data,
    _id: 'mock-song-id'
  })
}));
const MockAlbum = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: 'mock-album-id',
  save: mockAlbumSave.mockResolvedValue({
    ...data,
    _id: 'mock-album-id'
  })
}));
const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error('No file provided');
    }
    const result = await mockCloudinaryUpload(file.tempFilePath);
    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading to cloudinary");
  }
};
const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);
    const song = new MockSong({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });
    const savedSong = await song.save();
    if (albumId) {
      await mockAlbumFindByIdAndUpdate(albumId, {
        $push: { songs: savedSong._id },
      });
    }
    res.status(201).json(savedSong);
  } catch (error) {
    next(error);
  }
};
const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await mockSongFindById(id);
    if (song && song.albumId) {
      await mockAlbumFindByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    await mockSongFindByIdAndDelete(id);
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new MockAlbum({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (error) {
    next(error);
  }
};
const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await mockSongDeleteMany({ albumId: id });
    await mockAlbumFindByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const checkAdmin = async (req, res, next) => {
  try {
    res.status(200).json({ admin: true });
  } catch (error) {
    next(error);
  }
};
describe('Admin Controller', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      files: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });
  describe('createSong', () => {
    it('should create a new song', async () => {
      req.body = {
        title: 'New Test Song',
        artist: 'Test Artist',
        duration: 180
      };
      req.files = {
        audioFile: { tempFilePath: 'audio/path' },
        imageFile: { tempFilePath: 'image/path' }
      };
      mockCloudinaryUpload
        .mockResolvedValueOnce({ secure_url: 'https://mock-audio-url.com/song.mp3' })
        .mockResolvedValueOnce({ secure_url: 'https://mock-image-url.com/image.jpg' });
      await createSong(req, res, next);
      expect(mockCloudinaryUpload).toHaveBeenCalledTimes(2);
      expect(mockSongSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Song',
        artist: 'Test Artist'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    it('should update album when song is added to an album', async () => {
      req.body = {
        title: 'Album Song',
        artist: 'Test Artist',
        albumId: 'mock-album-id',
        duration: 180
      };
      req.files = {
        audioFile: { tempFilePath: 'audio/path' },
        imageFile: { tempFilePath: 'image/path' }
      };
      mockCloudinaryUpload
        .mockResolvedValueOnce({ secure_url: 'https://mock-audio-url.com/song.mp3' })
        .mockResolvedValueOnce({ secure_url: 'https://mock-image-url.com/image.jpg' });
      await createSong(req, res, next);
      expect(mockCloudinaryUpload).toHaveBeenCalledTimes(2);
      expect(mockSongSave).toHaveBeenCalled();
      expect(mockAlbumFindByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(next).not.toHaveBeenCalled();
    });
    it('should return 400 if files are missing', async () => {
      req.files = {};
      await createSong(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please upload all files" });
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with error if an exception occurs', async () => {
      req.body = {
        title: 'Test Song',
        artist: 'Test Artist'
      };
      req.files = {
        audioFile: { tempFilePath: 'audio/path' },
        imageFile: { tempFilePath: 'image/path' }
      };
      mockCloudinaryUpload.mockRejectedValueOnce(new Error('Upload failed'));
      await createSong(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('deleteSong', () => {
    it('should delete a song', async () => {
      req.params.id = 'mock-song-id';
      mockSongFindById.mockResolvedValue({
        _id: 'mock-song-id',
        title: 'Song to Delete',
        albumId: null
      });
      await deleteSong(req, res, next);
      expect(mockSongFindByIdAndDelete).toHaveBeenCalledWith('mock-song-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Song deleted successfully'
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should not update album if song has no albumId', async () => {
      req.params = { id: 'song123' };
      mockSongFindById.mockResolvedValue({
        _id: 'song123',
        albumId: null
      });
      await deleteSong(req, res, next);
      expect(mockAlbumFindByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockSongFindByIdAndDelete).toHaveBeenCalledWith('song123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with error if an exception occurs', async () => {
      req.params = { id: 'song123' };
      mockSongFindById.mockRejectedValue(new Error('Database error'));
      await deleteSong(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('createAlbum', () => {
    it('should create a new album', async () => {
      req.body = {
        title: 'New Test Album',
        artist: 'Test Artist',
        releaseYear: 2023
      };
      req.files = {
        imageFile: { tempFilePath: 'image/path' }
      };
      mockCloudinaryUpload.mockResolvedValue({ secure_url: 'https://mock-image-url.com/album.jpg' });
      await createAlbum(req, res, next);
      expect(mockCloudinaryUpload).toHaveBeenCalledTimes(1);
      expect(mockAlbumSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Album',
        artist: 'Test Artist'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with error if an exception occurs', async () => {
      req.body = {
        title: 'Test Album',
        artist: 'Test Artist'
      };
      req.files = {
        imageFile: { tempFilePath: 'image/path' }
      };
      mockCloudinaryUpload.mockRejectedValue(new Error('Upload failed'));
      await createAlbum(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('deleteAlbum', () => {
    it('should delete an album', async () => {
      req.params.id = 'mock-album-id';
      await deleteAlbum(req, res, next);
      expect(mockSongDeleteMany).toHaveBeenCalledWith({ albumId: 'mock-album-id' });
      expect(mockAlbumFindByIdAndDelete).toHaveBeenCalledWith('mock-album-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Album deleted successfully'
      });
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with error if an exception occurs', async () => {
      req.params = { id: 'album123' };
      mockSongDeleteMany.mockRejectedValue(new Error('Database error'));
      await deleteAlbum(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('checkAdmin', () => {
    it('should confirm admin status', async () => {
      await checkAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ admin: true });
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with error if an exception occurs', async () => {
      res.status = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      await checkAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
