// Central mocks for all tests
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Properly structured mock functions for Song model
export const findSort = jest.fn().mockReturnValue([]);
export const findSortMock = jest.fn();

export const findByIdExec = jest.fn().mockResolvedValue({
  _id: 'mock-song-id',
  title: 'Mock Song',
  artist: 'Mock Artist',
  imageUrl: 'https://example.com/song.jpg',
  audioUrl: 'https://example.com/song.mp3',
  duration: 180
});
export const findByIdMock = jest.fn();

export const aggregateMock = jest.fn();

export const countDocumentsMock = jest.fn().mockResolvedValue(100);

// In-memory stores to simulate database collections
const _songsStore = [];
const _albumsStore = [];

// Helper function to convert ID to string
const toIdString = (id) => {
  if (id instanceof mongoose.Types.ObjectId) return id.toString();
  return id;
};

// Helper function to check if string is a valid ObjectId
const isObjectIdLike = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper function to generate a mock ID
const genId = () => {
  return new mongoose.Types.ObjectId().toString();
};

// Helper function to sort by createdAt
const sortByCreatedAt = (arr, order) => {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === -1 ? dateB - dateA : dateA - dateB;
  });
};

// More carefully constructed Song mock
let lastSongInstance = null;
export const Song = function(data) {
  this._id = data._id || genId();
  this.title = data.title;
  this.artist = data.artist;
  this.imageUrl = data.imageUrl;
  this.audioUrl = data.audioUrl;
  this.duration = data.duration;
  this.albumId = data.albumId;
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  this.save = jest.fn(async () => {
    const requiredFields = ['title', 'artist', 'imageUrl', 'audioUrl', 'duration'];
    const missingFields = requiredFields.filter(field => !this[field]);
    if (missingFields.length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {};
      missingFields.forEach(field => {
        error.errors[field] = {
          message: `${field} is required`,
          path: field,
          value: undefined
        };
      });
      throw error;
    }
    const idx = _songsStore.findIndex(s => s._id === this._id);
    if (idx === -1) {
      _songsStore.push(this);
    } else {
      _songsStore[idx] = this;
    }
    return this;
  });
  lastSongInstance = this;
};

export const getLastSongInstance = () => lastSongInstance;

// Mock for made-for-you songs
const mockMadeForYouSongs = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Made For You Song 1",
    artist: "Test Artist 1",
    albumId: new mongoose.Types.ObjectId(),
    duration: 180,
    genre: "Pop",
    releaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: "https://example.com/image1.jpg",
    audioUrl: "https://example.com/audio1.mp3"
  }
];

// Clear mock stores before each test
export const clearMockStores = () => {
  _songsStore.length = 0;
  _albumsStore.length = 0;
};

Song.find = jest.fn((query = {}) => {
  let result = _songsStore.filter((s) =>
    Object.entries(query).every(([k, v]) => s[k] === v)
  );
  return Array.from(result);
});

Song.findExec = (query = {}) => {
  let result = _songsStore.filter((s) =>
    Object.entries(query).every(([k, v]) => s[k] === v)
  );
  const chain = {
    exec: () => Promise.resolve(Array.from(result)),
    sort: (sortObj) => {
      if (sortObj && sortObj.createdAt) {
        result = sortByCreatedAt(result, sortObj.createdAt);
      }
      return chain;
    },
    limit: (n) => {
      result = result.slice(0, n);
      return chain;
    }
  };
  return chain;
};

Song.findById = jest.fn((id) => {
  const idStr = toIdString(id);
  if (!isObjectIdLike(idStr)) {
    const error = new Error('Invalid ObjectId');
    error.name = 'CastError';
    error.kind = 'ObjectId';
    return {
      exec: () => Promise.reject(error)
    };
  }
  return {
    exec: () => {
      const song = _songsStore.find((s) => s._id === idStr);
      if (!song) {
        const error = new Error('Song not found');
        error.status = 404;
        return Promise.reject(error);
      }
      return Promise.resolve(song);
    }
  };
});

Song.create = jest.fn().mockImplementation(async (data) => {
  if (Array.isArray(data)) {
    const created = data.map((d) => new Song(d));
    _songsStore.push(...created);
    return created;
  }
  const doc = new Song(data);
  _songsStore.push(doc);
  return doc;
});

Song.findByIdAndUpdate = jest.fn((id, update) => {
  return {
    exec: () => {
      const idx = _songsStore.findIndex(s => s._id === toIdString(id));
      if (idx === -1) return Promise.resolve(null);
      Object.assign(_songsStore[idx], update);
      return Promise.resolve(_songsStore[idx]);
    }
  };
});

Song.findByIdAndDelete = jest.fn((id) => {
  return {
    exec: () => {
      const idx = _songsStore.findIndex(s => s._id === toIdString(id));
      if (idx === -1) return Promise.resolve(null);
      const [deleted] = _songsStore.splice(idx, 1);
      return Promise.resolve(deleted);
    }
  };
});

Song.countDocuments = jest.fn(() => Promise.resolve(_songsStore.length));

Song.aggregate = jest.fn((pipeline) => {
  // Allow test to override this mock if needed
  if (Song.aggregate._mockImpl) {
    return Song.aggregate._mockImpl(pipeline);
  }
  // Default: return all songs, projected if needed
  let result = [..._songsStore];
  const projectStage = pipeline && pipeline.find(stage => stage.$project);
  if (projectStage) {
    result = result.map(song => {
      const proj = {};
      for (const key in projectStage.$project) {
        if (song[key] !== undefined) proj[key] = song[key];
      }
      return proj;
    });
  }
  const sampleStage = pipeline && pipeline.find(stage => stage.$sample);
  if (sampleStage) {
    result = result.slice(0, sampleStage.$sample.size);
  }
  return Promise.resolve(result);
});

// Album model mocks
export const albumFindSort = jest.fn().mockReturnValue([]);
export const albumFindSortMock = jest.fn();

export const albumPopulateExec = jest.fn().mockResolvedValue({
  _id: 'mock-album-id',
  title: 'Mock Album',
  artist: 'Mock Artist',
  imageUrl: 'https://example.com/album.jpg',
  songs: []
});
export const albumPopulate = jest.fn().mockReturnValue({ exec: albumPopulateExec });
export const albumFindByIdMock = jest.fn();

export const albumCountDocumentsMock = jest.fn().mockResolvedValue(25);

// More carefully constructed Album mock
let lastAlbumInstance = null;
export const Album = function(data) {
  this._id = data._id || genId();
  this.title = data.title;
  this.artist = data.artist;
  this.imageUrl = data.imageUrl;
  this.songs = data.songs || [];
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  this.save = jest.fn(async () => {
    const requiredFields = ['title', 'artist', 'imageUrl'];
    const missingFields = requiredFields.filter(field => !this[field]);
    if (missingFields.length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {};
      missingFields.forEach(field => {
        error.errors[field] = {
          message: `${field} is required`,
          path: field,
          value: undefined
        };
      });
      throw error;
    }
    const idx = _albumsStore.findIndex(a => a._id === this._id);
    if (idx === -1) {
      _albumsStore.push(this);
    } else {
      _albumsStore[idx] = this;
    }
    return this;
  });
  lastAlbumInstance = this;
};

export const getLastAlbumInstance = () => lastAlbumInstance;

Album.find = jest.fn((query = {}) => {
  let result = _albumsStore.filter((a) =>
    Object.entries(query).every(([k, v]) => a[k] === v)
  );
  return Array.from(result);
});

Album.findExec = (query = {}) => {
  let result = _albumsStore.filter((a) =>
    Object.entries(query).every(([k, v]) => a[k] === v)
  );
  const chain = {
    exec: () => Promise.resolve(Array.from(result)),
    sort: (sortObj) => {
      if (sortObj && sortObj.createdAt) {
        result = sortByCreatedAt(result, sortObj.createdAt);
      }
      return chain;
    },
    limit: (n) => {
      result = result.slice(0, n);
      return chain;
    }
  };
  return chain;
};

Album.findById = jest.fn((id) => {
  const idStr = toIdString(id);
  if (!isObjectIdLike(idStr)) {
    const error = new Error('Invalid ObjectId');
    error.name = 'CastError';
    error.kind = 'ObjectId';
    return {
      populate: () => ({
        exec: () => Promise.reject(error)
      }),
      exec: () => Promise.reject(error)
    };
  }
  const album = _albumsStore.find((a) => a._id === idStr);
  if (!album) {
    const error = new Error('Album not found');
    error.status = 404;
    return {
      populate: () => ({
        exec: () => Promise.reject(error)
      }),
      exec: () => Promise.reject(error)
    };
  }
  return {
    populate: function (field) {
      return {
        exec: () => {
          if (field === 'songs') {
            const songs = _songsStore.filter(s => s.albumId === album._id);
            return Promise.resolve({ ...album, songs });
          }
          return Promise.resolve(album);
        }
      };
    },
    exec: () => Promise.resolve(album)
  };
});

Album.create = jest.fn().mockImplementation(async (data) => {
  if (Array.isArray(data)) {
    const created = data.map((d) => new Album(d));
    _albumsStore.push(...created);
    return created;
  }
  const doc = new Album(data);
  _albumsStore.push(doc);
  return doc;
});

Album.findByIdAndUpdate = jest.fn((id, update) => {
  return {
    exec: () => {
      const idx = _albumsStore.findIndex(a => a._id === toIdString(id));
      if (idx === -1) return Promise.resolve(null);
      Object.assign(_albumsStore[idx], update);
      return Promise.resolve(_albumsStore[idx]);
    }
  };
});

Album.findByIdAndDelete = jest.fn((id) => {
  return {
    exec: () => {
      const idx = _albumsStore.findIndex(a => a._id === toIdString(id));
      if (idx === -1) return Promise.resolve(null);
      const [deleted] = _albumsStore.splice(idx, 1);
      return Promise.resolve(deleted);
    }
  };
});

Album.countDocuments = jest.fn(() => Promise.resolve(_albumsStore.length));

// User model mocks
export const userFindExec = jest.fn().mockResolvedValue([]);
export const userFindMock = jest.fn().mockReturnValue({ exec: userFindExec });

export const userFindByIdExec = jest.fn().mockResolvedValue({
  _id: 'mock-user-id',
  username: 'mockuser',
  email: 'mock@example.com',
  role: 'user',
  isAdmin: false
});
export const userFindByIdMock = jest.fn().mockReturnValue({ exec: userFindByIdExec });

export const userFindOneExec = jest.fn().mockResolvedValue({
  _id: 'mock-user-id',
  username: 'mockuser',
  email: 'mock@example.com',
  role: 'user',
  isAdmin: false,
  verifyPassword: jest.fn().mockReturnValue(true)
});
export const userFindOneMock = jest.fn().mockReturnValue({ exec: userFindOneExec });

export const userCountDocumentsMock = jest.fn().mockResolvedValue(50);

export const User = {
  find: userFindMock,
  findById: userFindByIdMock,
  create: jest.fn().mockResolvedValue({ _id: 'mock-user-id', username: 'Created User' }),
  findOne: userFindOneMock,
  countDocuments: userCountDocumentsMock
};

// Mock Cloudinary library
export const cloudinary = {
  uploadImage: jest.fn().mockResolvedValue({
    url: 'https://test-cloudinary-url.com/image.jpg',
    publicId: 'test-public-id'
  }),
  deleteImage: jest.fn().mockResolvedValue({ result: 'ok' }),
  uploadAudio: jest.fn().mockResolvedValue({
    url: 'https://test-cloudinary-url.com/audio.mp3',
    publicId: 'test-public-id-audio'
  }),
  deleteAudio: jest.fn().mockResolvedValue({ result: 'ok' })
};

const mockSong = {
  _id: "mock-song-id",
  title: "Mock Song",
  artist: "Mock Artist",
  audioUrl: "https://example.com/mock-audio.mp3",
  imageUrl: "https://example.com/mock-image.jpg",
  createdAt: new Date(),
  save: jest.fn().mockResolvedValue({
    _id: "mock-song-id",
    title: "Mock Song",
    artist: "Mock Artist",
    audioUrl: "https://example.com/mock-audio.mp3",
    imageUrl: "https://example.com/mock-image.jpg",
    createdAt: new Date(),
  }),
};

const mockAlbum = {
  _id: "mock-album-id",
  title: "Mock Album",
  artist: "Mock Artist",
  imageUrl: "https://example.com/mock-album-image.jpg",
  songs: [mockSong],
  save: jest.fn().mockResolvedValue({
    _id: "mock-album-id",
    title: "Mock Album",
    artist: "Mock Artist",
    imageUrl: "https://example.com/mock-album-image.jpg",
    songs: [mockSong],
  }),
};

// Mock Song model
export const Song = {
  find: () => ({
    sort: findSortMock,
  }),
  findById: findByIdMock,
  aggregate: aggregateMock,
};

// Mock Album model
export const Album = {
  find: () => ({
    sort: albumFindSort,
  }),
  findById: () => ({
    populate: albumFindByIdMock,
  }),
};

// Mock model constructors
export const createMockSong = () => ({
  ...mockSong,
  save: jest.fn().mockResolvedValue(mockSong),
});

export const createMockAlbum = () => ({
  ...mockAlbum,
  save: jest.fn().mockResolvedValue(mockAlbum),
});

// Mock storage operations
export const mockStorage = {
  uploadAudio: jest.fn().mockResolvedValue({ url: 'https://example.com/mock-audio.mp3' }),
  uploadImage: jest.fn().mockResolvedValue({ url: 'https://example.com/mock-image.jpg' }),
  deleteAudio: jest.fn().mockResolvedValue({ result: 'ok' }),
  deleteImage: jest.fn().mockResolvedValue({ result: 'ok' })
};
