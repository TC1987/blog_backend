const jwt = require('jsonwebtoken');
const errorGenerator = require('./helpers/error');

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
		const error = errorGenerator('JsonWebTokenError', 'Expired Token or Invalid Token/Scheme');
		return next(error);
	}

	req.user = user;
	next();
};

const unknownEndpoint = (request, response) => {
	return response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id' });
	} 

	if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message });
	}

	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			error: error.message
		});
	}

	next(error);
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	validateToken
};