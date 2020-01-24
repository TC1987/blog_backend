const router = require('express').Router();
const User = require('./../models/User');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return res.status(400).json({
			error: 'invalid email'
		});
	}

	user.comparePassword(req.body.password, (err, isMatch) => {
		if (err || !isMatch) {
			return res.status(400).json({
				error: 'invalid password'
			});
		}
		
		jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: '365d' }, (err, token) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					error: 'error generating token'
				});
			}

			return res.json({
				user,
				token
			});
		});
	});
});

module.exports = router;