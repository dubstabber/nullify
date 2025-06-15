// Mock implementation of stat.controller.js
export const getStats = jest.fn().mockImplementation(async (req, res, next) => {
  try {
    res.status(200).json({
      totalSongs: 100,
      totalUsers: 50,
      totalAlbums: 25,
      totalArtists: 30
    });
  } catch (error) {
    next(error);
  }
});
