const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
	const users = await User.find({});
	return res.json(users.map(user => user.toJSON()));
});

router.get('/:id', async (req, res) => {
	let user;

	try {
		user = await User.findById(req.params.id).populate('blogs').exec();
	} catch (err) {
		console.log(err.message);
		return res.status(400).json({
			error: 'invalid mongoid'
		});
	}

	if (!user) {
		return res.status(404).json({
			error: 'user does not exist'
		});
	}

	return res.json(user.toJSON());
});

router.post('/', async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(409).json({
			error: 'email already exists'
		});
	}

	const newUser = new User({
		...req.body
	});

	const savedUser = await newUser.save();

	if (!savedUser) {
		return next('error saving user');
	}
	console.log(savedUser);
	return res.json(savedUser.toJSON());
});

router.put('/:id', (req, res) => res.send('users put'));

router.delete('/:id', (req, res) => res.send('users delete'));

module.exports = router;