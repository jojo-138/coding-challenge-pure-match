const { sequelize } = require('../db/models');
const uniquePhotoName = require('../lib/uniquePhotoName');
const uploadPhoto = require('../lib/s3/uploadPhoto');
const Post = require('../db/models').Post;
const Photo = require('../db/models').Photo;

module.exports = async (req, res, client) => {
	/*
		assuming that old photos and 
		newly added photos are differentiated by the client
		and only new photos are sent in the PUT req
	*/
	const { id, title, description } = req.body;
	const photos = req.files ? Object.values(req.files) : [];

	if (!title)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing title. Please enter a title.' });

	const t = await sequelize.transaction();
	try {
		await Post.update(
			{
				title,
				description,
			},
			{
				where: { id },
				transaction: t,
			}
		);

		if (photos.length) {
			const photoBulk = [];

			for (const photo of photos) {
				photo.name = uniquePhotoName(photo.name);

				photoBulk.push({
					name: photo.name,
					postId: id,
				});
			}

			// add photo name to db
			await Photo.bulkCreate([...photoBulk], { transaction: t });

			await Post.increment(
				{ photoCount: photos.length },
				{
					where: { id },
					transaction: t,
					returning: false,
				}
			);

			// upload photo to storage
			photos.forEach(async (photo) => {
				await uploadPhoto(photo, client);
			});
		}

		await t.commit();

		return res.status(200).end();
	} catch (e) {
		// console.log(e.message);
		await t.rollback();
		return res.status(500).end();
	}
};
