const getPhoto = require('../lib/s3/getPhoto');
const getTimeDiff = require('../lib/getTimeDiff');
const User = require('../db/models').User;
const Post = require('../db/models').Post;
const Photo = require('../db/models').Photo;

module.exports = async (req, res, client) => {
	const { limit, offset } = req.params;

	try {
		const postRes = [];
		const posts = await Post.findAll({
			attributes: ['id', 'title', 'description', 'createdAt'],
			include: [
				{ model: User, attributes: ['name'] },
				{ model: Photo, attributes: ['id', 'name'] },
			],
			order: [['createdAt', 'DESC']],
			limit,
			offset: limit * (offset ?? 0),
		});

		for (const post of posts) {
			const { id, title, description, createdAt, Photos: photos, User: user } = post.dataValues;
			const res = {
				id: id,
				title: title,
				description: description,
				photos: [],
				postedBy: user.dataValues.name,
				timeDifference: getTimeDiff(new Date(), createdAt),
			};

			for (const photo of photos) {
				const { id, name } = photo.dataValues;
				// get photo url from storage
				const url = await getPhoto(name, client);
				res.photos.push({ id, name, url });
			}

			postRes.push(res);
		}

		return res.send({ posts: postRes });
	} catch (e) {
		// console.log(e.message);
		return res.status(500).end();
	}
};
