import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
	try {
		const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
			Song.countDocuments().exec(),
			Album.countDocuments().exec(),
			User.countDocuments().exec(),
			Song.aggregate([
				{
					$group: {
						_id: "$artist"
					}
				},
				{
					$count: "count"
				}
			]).exec()
		]);

		res.status(200).json({
			totalSongs,
			totalAlbums,
			totalUsers,
			totalArtists: uniqueArtists[0]?.count || 0
		});
	} catch (error) {
		next(error);
	}
};
