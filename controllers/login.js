const router = require('express').Router();
const User = require('./../models/User');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return res.status(400).json({
			error: 'Invalid Email'
		});
	}

	user.comparePassword(req.body.password, (err, isMatch) => {
		if (err || !isMatch) {
			return res.status(400).json({
				error: 'Invalid Password'
			});
		}
		
		jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: '365d' }, (err, token) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					error: 'Error Generating Token'
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