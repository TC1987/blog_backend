const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
	let token = req.get('authorization') || req.header('authorization');
	let user;

	if (!token) {
		return next('missing token');
	}

	token = token.split(' ')[1];

	try {
		user = jwt.verify(token, process.env.SECRET);
	} catch (err) {
		return next('invalid token or token scheme');
	}

	req.user = user;
	next();
};

module.exports = {
	validateToken
};