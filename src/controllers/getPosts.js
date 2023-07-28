const getPhoto = require('../lib/getPhoto');
const User = require('../db/models').User;
const Post = require('../db/models').Post;

module.exports = async (req, res, client) => {
	try {
		const posts = await Post.findAll({
			attributes: ['title', 'description', 'photo'],
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: User,
					attributes: ['name'],
				},
			],
		});
		const photoNames = posts.map((post) => post.dataValues.photo);
		const photoUrlList = [];

		for (const photoName of photoNames) {
			if (photoName && photoName.length) {
				// get photo url from storage
				const photoUrl = await getPhoto(photoName, client);
				photoUrlList.push(photoUrl);
			} else {
				photoUrlList.push(null);
			}
		}

		const postRes = posts.map((post, i) => {
			return {
				title: post.dataValues.title,
				description: post.dataValues.description,
				photo: photoUrlList[i],
				postedBy: post.dataValues.User.dataValues.name,
			};
		});

		return res.send({ posts: [...postRes] });
	} catch (e) {
		// console.log(e.message);
		return res.status(500).end();
	}
};
