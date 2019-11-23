const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
	let token = req.get('authorization') || req.header('authorization');
	let payload;

	if (!token) {
		next({
			error: 'missing token or invalid scheme'
		});
	}

	// JWTs use the Bearer scheme and so we can easily split by the space to get just the token.
	try {
		payload = jwt.verify(token, process.env.SECRET);
	} catch (err) {
		next(err);
	}

	req.token = payload.token;
	req.user = payload.user;
	next();
};

module.exports = {
	validateToken
};