const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/models').User;
const { emailRegEx, passwordRegEx } = require('../regEx');

module.exports = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res
			.status(400)
			.send({ status: 'error', message: 'Missing credentials. Please complete form.' });

	if (!emailRegEx.test(email))
		return res.status(400).send({ status: 'error', message: 'Invalid email address.' });

	if (!passwordRegEx.test(password))
		return res
			.status(400)
			.send({ status: 'error', message: 'Password must be a minimum of 8 characters.' });

	try {
		const hash = await User.findAll({
			attributes: ['id', 'hash'],
			where: { email },
		});

		// email does not exist in db
		if (!hash.length)
			return res
				.status(400)
				.send({ status: 'error', message: 'Incorrect credentials. Please try again.' });

		const isValidPassword = await bcrypt.compare(password, hash[0].dataValues.hash);

		if (isValidPassword) {
			const token = jwt.sign({ userId: hash[0].dataValues.id }, process.env.JWT_KEY, {
				algorithm: process.env.JWT_ALG,
				issuer: process.env.JWT_ISSUER,
				audience: process.env.JWT_AUDIENCE,
				expiresIn: process.env.JWT_EXP_TIME,
			});

			return res
				.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: false }) // sameSite value depends on client domain
				.status(200)
				.end();
		} else {
			// incorrect password
			return res
				.status(400)
				.send({ status: 'error', message: 'Incorrect credentials. Please try again.' });
		}
	} catch (e) {
		console.log(e.message);
		return res.status(500).end();
	}
};
