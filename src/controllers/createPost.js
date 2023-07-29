const { sequelize } = require('../db/models');
const uniquePhotoName = require('../lib/uniquePhotoName');
const uploadPhoto = require('../lib/s3/uploadPhoto');
const Post = require('../db/models').Post;
const Photo = require('../db/models').Photo;

module.exports = async (req, res, client) => {
	const { title, description } = req.body;
	const photos = req.files ? Object.values(req.files) : [];

	if (!title)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing title. Please enter a title.' });

	const t = await sequelize.transaction();
	try {
		// create new post
		const newPost = await Post.create(
			{
				title,
				description,
				userId: req.userId,
				photoCount: photos.length,
			},
			{ transaction: t }
		);

		if (photos.length) {
			const photoBulk = [];

			for (const photo of photos) {
				photo.name = uniquePhotoName(photo.name);

				photoBulk.push({
					name: photo.name,
					postId: newPost.id,
				});
			}

			// add photo name to db
			await Photo.bulkCreate([...photoBulk], { transaction: t });

			// upload photo to storage
			photos.forEach(async (photo) => {
				await uploadPhoto(photo, client);
			});
		}

		await t.commit();

		return res.status(200).end();
	} catch (e) {
		console.log(e.message);
		await t.rollback();
		return res.status(500).end();
	}
};
