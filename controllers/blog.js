const router = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { validateToken } = require('../utils/middleware');

router.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('author', 'id name').exec();
	return res.json(blogs.map(blog => blog.toJSON()));
});

router.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	return res.json(blog.toJSON());
});

router.post('/', validateToken, async (req, res) => {
	const newBlog = new Blog({
		...req.body,
		author: req.user.id
	});

	const author = await User.findById(req.user.id);

	author.blogs = [...author.blogs, newBlog._id];
	author.save();

	const savedBlog = await newBlog.save();

	let POJO = savedBlog.toObject();

	POJO = {
		...POJO,
		author: {
			name: author.name,
			id: author._id
		},
		id: POJO._id
	};

	delete POJO._id;
	delete POJO.__v;

	return res.json(POJO);
});

router.put('/:id', async (req, res) => {
	const content = req.body;
	const author = {
		...content.author
	};

	content.author = content.author.id;
	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, content, { new: true });
	let POJO = updatedBlog.toObject();

	POJO = {
		...POJO,
		author,
		id: POJO._id
	};

	delete POJO._id;
	delete POJO.__v;

	return res.json(POJO);
});

router.delete('/:id', async (req, res) => {
	const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
	console.log(deletedBlog);
	return res.json(deletedBlog.toJSON());
});

module.exports = router;