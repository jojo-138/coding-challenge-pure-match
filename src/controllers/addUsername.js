const User = require('../db/models').User;

module.exports = async (req, res) => {
	const { username } = req.body;

	if (!username)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing username. Please enter a username.' });

	try {
		await User.update({ username }, { where: { id: req.userId } });

		return res.status(200).end();
	} catch (e) {
		console.log(e.message);
		if (e.message === 'Validation error')
			return res.status(400).send({ status: 'error', message: 'Username already taken.' });
		return res.status(500).end();
	}
};
