const uploadPhoto = require('../lib/uploadPhoto');
const Post = require('../db/models').Post;

module.exports = async (req, res, client) => {
	const { title, description } = req.body;

	if (!title)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing title. Please enter a title.' });

	try {
		if (req.files) {
			// upload photo to storage
			await uploadPhoto(req.files?.photo, client);
		}

		// create new post
		await Post.create({
			title,
			description,
			photo: req.files?.photo?.name ?? '',
			userId: req.userId,
		});

		return res.status(200).end();
	} catch (e) {
		// console.log(e.message);
		return res.status(500).end();
	}
};
