const deletePhoto = require('../lib/s3/deletePhoto');
const Post = require('../db/models').Post;
const Photo = require('../db/models').Photo;

module.exports = async (req, res, client) => {
	const { id } = req.body;

	try {
		const photos = await Photo.findAll({
			attributes: ['name'],
			where: { postId: id },
		});

		const postDestroyRes = await Post.destroy({
			where: { id },
		});

		// post successfully deleted
		if (postDestroyRes !== 0) {
			// delete from s3
			photos.forEach(async (photo) => {
				await deletePhoto(photo.dataValues.name, client);
			});
		} else {
			// if post is not found and destroyed
			return res.status(404).end();
		}

		return res.status(200).end();
	} catch (e) {
		// console.log(e.message);
		return res.status(500).end();
	}
};
