// Mock Song model for tests
import { jest } from '@jest/globals';

// Create the Song mock object with jest.fn()
const Song = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  // Support for model instantiation
  prototype: {
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  }
};

// Setup default mock implementations
Song.find.mockReturnValue({
  sort: jest.fn().mockReturnValue(Song.find),
  exec: jest.fn().mockResolvedValue([])
});

Song.find.sort = jest.fn().mockReturnThis();

Song.findById.mockReturnValue({
  exec: jest.fn().mockResolvedValue({
    _id: 'default-mock-id',
    title: 'Mock Song',
    artist: 'Mock Artist',
    imageUrl: 'https://example.com/song.jpg',
    audioUrl: 'https://example.com/song.mp3',
    duration: 180
  })
});

Song.create.mockImplementation((data) => {
  return Promise.resolve({
    _id: 'mock-song-id',
    ...data
  });
});

Song.findByIdAndUpdate.mockReturnValue({
  exec: jest.fn().mockResolvedValue({
    _id: 'default-mock-id',
    title: 'Updated Mock Song'
  })
});

Song.findByIdAndDelete.mockReturnValue({
  exec: jest.fn().mockResolvedValue({ _id: 'default-mock-id', deleted: true })
});

Song.countDocuments.mockResolvedValue(100);

Song.aggregate.mockResolvedValue([
  {
    _id: 'mock-song-id-1',
    title: 'Mock Aggregated Song',
    artist: 'Mock Artist',
    imageUrl: 'https://example.com/mock.jpg',
    audioUrl: 'https://example.com/mock.mp3',
    duration: 180
  }
]);

// Add constructor functionality to Song
function SongConstructor(data) {
  return {
    ...data,
    _id: data._id || 'mock-constructed-song-id',
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  };
}

// Add constructor properties to Song object
Object.setPrototypeOf(Song, SongConstructor);

export { Song };
export default Song;
