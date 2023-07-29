const Comment = require('../db/models').Comment;

module.exports = async (req, res) => {
	const { postId, content } = req.body;

	if (!content)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing comment. Please enter a comment.' });

	try {
		await Comment.create({
			content,
			postId,
			userId: req.userId,
		});

		return res.status(200).end();
	} catch (e) {
		console.log(e.message);
		return res.status(500).end();
	}
};
