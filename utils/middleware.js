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

const unknownEndpoint = (req, res) => {
	return res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'malformatted id' });
	} 

	if (error.name === 'ValidationError' || error.name === 'FileError') {
		return res.status(400).send({ error: error.message });
	}

	if (error.name === 'MulterError') {
		return res.status(401).json({ error: `Error: ${ error.message.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') }` });
	}

	if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({
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