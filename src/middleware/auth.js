const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	if (!req.cookies.token) return res.status(401).end();

	try {
		const { userId } = jwt.verify(req.cookies.token, process.env.JWT_KEY, {
			issuer: process.env.JWT_ISSUER,
			audience: process.env.JWT_AUDIENCE,
		});

		req.userId = userId;
		next();
	} catch (e) {
		// console.log(e.message);
		return res.status(401).end();
	}
};
