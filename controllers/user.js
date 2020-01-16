const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { validateToken } = require('../utils/middleware');

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
			error: 'Email Already Exists'
		});
	}

	const newUser = new User({
		...req.body
	});

	const savedUser = await newUser.save();

	if (!savedUser) {
		return next('Error Saving User');
	}

	jwt.sign(savedUser.toJSON(), process.env.SECRET, { expiresIn: '1h' }, (err, token) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				error: 'Error Generating Token'
			});
		}

		console.log(savedUser);
		console.log(token);

		return res.json({
			user: savedUser,
			token
		});
	});
});

// router.put('/:id', (req, res) => res.send('users put'));

// Need to check and make sure not already following the person. Unfollow/Follow needed on frontend.
router.patch('/:id', validateToken, async (req, res) => {
	const { op, field, value } = req.body;

	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{ [op]: { [field]: value } },
		{ new: true }
	);

	console.log(updatedUser);

	return res.json(updatedUser.toJSON());
});

router.delete('/:id', (req, res) => res.send('users delete'));

module.exports = router;