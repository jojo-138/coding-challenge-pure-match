const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/models').User;
const { emailRegEx, passwordRegEx } = require('../regEx');

module.exports = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password)
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
		const hash = await bcrypt.hash(password, 14);
		const newUser = await User.create({
			name,
			email,
			hash,
		});
		const token = jwt.sign({ userId: newUser.id }, process.env.JWT_KEY, {
			algorithm: process.env.JWT_ALG,
			issuer: process.env.JWT_ISSUER,
			audience: process.env.JWT_AUDIENCE,
			expiresIn: process.env.JWT_EXP_TIME,
		});

		return res
			.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }) // sameSite value depends on client domain
			.status(200)
			.end();
	} catch (e) {
		// console.log(e.message);
		if (e.message === 'Validation error')
			return res.status(400).send({ status: 'error', message: 'Email address already taken.' });
		return res.status(500).end();
	}
};
