const router = require('express').Router();
const Blog = require('../models/Blog');
const { validateToken } = require('../utils/middleware');

router.get('/', async (req, res) => {
	const blogs = await Blog.find({});
	return res.json(blogs.map(blog => blog.toJSON()));
});

router.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	return res.json(blog.toJSON());
});

router.post('/', validateToken, async (req, res) => {
	const newBlog = new Blog({
		...req.body
	});

	const savedBlog = await newBlog.save();
	return res.json(savedBlog.toJSON());
});

router.put('/:id', (req, res) => res.send('blog put'));

router.delete('/:id', (req, res) => res.send('blog delete'));

module.exports = router;