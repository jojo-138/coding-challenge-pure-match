const deletePhoto = require('../lib/s3/deletePhoto');
const Post = require('../db/models').Post;
const Photo = require('../db/models').Photo;

module.exports = async (req, res, client) => {
	/*
    assuming that client sends a separate API call from PUT /post
    ONLY when user deletes photos
  */
	const { postId, photoList } = req.body;

	try {
		// check if photo belongs to user
		const postData = await Post.findByPk(postId);

		if (!postData) return res.status(401).end();

		const destroyRes = await Photo.destroy({
			where: {
				id: photoList.map((photo) => photo.id),
				postId,
			},
		});

		// photos successfully deleted
		if (destroyRes !== 0) {
			await Post.decrement(
				{ photoCount: photoList.length },
				{
					where: { id: postId },
					returning: false,
				}
			);

			// delete from s3
			photoList.forEach(async (photo) => {
				await deletePhoto(photo.name, client);
			});
		} else {
			// if photos and postId do not correlate and nothing is destroyed
			return res.status(400).send();
		}

		return res.status(200).end();
	} catch (e) {
		console.log(e.message);
		return res.status(500).end();
	}
};
