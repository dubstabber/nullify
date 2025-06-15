// Mock Album model for tests
import { jest } from '@jest/globals';
import { mockAlbumModel } from '../mocks.js';

// Create the Album mock object with jest.fn()
const Album = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  // Support for model instantiation
  prototype: {
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  }
};

// Setup default mock implementations
Album.find.mockReturnValue({
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([])
});

Album.findById.mockReturnValue({
  populate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue({
      _id: 'default-mock-id',
      title: 'Mock Album',
      artist: 'Mock Artist',
      imageUrl: 'https://example.com/album.jpg',
      songs: []
    })
  }),
  exec: jest.fn().mockResolvedValue({
    _id: 'default-mock-id',
    title: 'Mock Album',
    artist: 'Mock Artist',
    imageUrl: 'https://example.com/album.jpg',
    songs: []
  })
});

Album.create.mockImplementation((data) => {
  return Promise.resolve({
    _id: 'mock-album-id',
    ...data
  });
});

Album.findByIdAndUpdate.mockReturnValue({
  exec: jest.fn().mockResolvedValue({
    _id: 'default-mock-id',
    title: 'Updated Mock Album'
  })
});

Album.findByIdAndDelete.mockReturnValue({
  exec: jest.fn().mockResolvedValue({ _id: 'default-mock-id', deleted: true })
});

Album.countDocuments.mockResolvedValue(25);

const mockAlbum = mockAlbumModel;
export { mockAlbum };
export default mockAlbum;
