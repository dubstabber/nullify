import { Album } from "../../src/models/album.model.js";
import { Song } from "../../src/models/song.model.js";
import { User } from "../../src/models/user.model.js";

export const getStatsDebug = async (req, res, next) => {
  try {
    console.log("Song.countDocuments:", Song.countDocuments);
    console.log("User.countDocuments:", User.countDocuments);
    console.log("Album.countDocuments:", Album.countDocuments);
    console.log("Song.aggregate:", Song.aggregate);
    
    const totalSongs = await Song.countDocuments();
    console.log("totalSongs:", totalSongs);
    
    const totalUsers = await User.countDocuments();
    console.log("totalUsers:", totalUsers);
    
    const totalAlbums = await Album.countDocuments();
    console.log("totalAlbums:", totalAlbums);
    
    const uniqueArtists = await Song.aggregate([
      {
        $unionWith: {
          coll: "albums",
          pipeline: [],
        },
      },
      {
        $group: {
          _id: "$artist",
        },
      },
      {
        $count: "count",
      },
    ]);
    console.log("uniqueArtists:", uniqueArtists);
    
    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.log("Error caught:", error);
    next(error);
  }
};
