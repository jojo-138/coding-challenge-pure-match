const User = require('../db/models').User;
const Comment = require('../db/models').Comment;

module.exports = async (req, res) => {
	const { postId, limit, offset } = req.params;

	try {
		const comments = await Comment.findAll({
			attributes: ['id', 'content'],
			include: [{ model: User, attributes: ['name'] }],
			where: { postId },
			order: [['createdAt', 'DESC']],
			limit,
			offset: limit * (offset ?? 0),
		});

		const commentsRes = comments.map((comment) => {
			const {
				id,
				content,
				User: {
					dataValues: { name },
				},
			} = comment.dataValues;

			return { id, content, commentedBy: name };
		});

		return res.send({ comments: commentsRes });
	} catch (e) {
		console.log(e.message);
		return res.status(500).end();
	}
};
