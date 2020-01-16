const router = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { validateToken } = require('../utils/middleware');
const { upload } = require('../utils/multer');

router.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('author', 'id name');
	return res.json(blogs.map(blog => blog.toJSON()));
});

router.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id).populate('author', 'id name');
	return res.json(blog.toJSON());
});

router.get('/:id/comments', async (req, res) => {
	const comments = await Comment.find({ blogId: req.params.id });
	return res.json(comments.map(comment => comment.toJSON()));
});

// validate everything but file. if error, don't bother with file and return an error
// if everything but file is good, validate file using multer
// if error with file, don't save new object to database and return error
router.post('/', validateToken, async (req, res) => {


	const extractTags = tags => {
		return tags.split(' ').map(tag => {
			if (tag[tag.length - 1] === ',') {
				return tag.slice(0, tag.length - 1);
			}
			return tag;
		});
	};

	const getReadTime = content => {
		const numberOfWords = content.split(' ').length;

		switch (numberOfWords) {
			case numberOfWords > 100:
				return '10+';
			case numberOfWords > 50:
				return '5';
			case numberOfWords > 20:
				return '3';
			case numberOfWords > 10:
				return '1';
			default:
				return '< 1';
		}
	};

	const newBlog = new Blog({
		...req.body,
		tags: req.body.tags && extractTags(req.body.tags),
		readTime: getReadTime(req.body.content),
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

router.post('/:id/comments', async (req, res, next) => {
	try {
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return next('invalid blog id');
		}

		const comment = new Comment({
			...req.body,
			blogId: blog.id
		});

		console.log(comment);

		blog.comments = [...blog.comments, comment.id];

		await blog.save();
		await comment.save();

		return res.json(comment.toJSON());
	} catch (err) {
		console.log(err.message);
		return res.status(400).json({
			error: 'error saving comment'
		});
	}

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

router.delete('/:id', validateToken, async (req, res) => {
	let deletedBlog;
	let blogAuthor;

	try {
		deletedBlog = await Blog.findByIdAndDelete(req.params.id);
		blogAuthor = await User.findById(req.user.id);

		if (!deletedBlog.author.equals(blogAuthor._id)) {
			return res.status(401).end();
		}

		blogAuthor.blogs = blogAuthor.blogs.filter(blogId => !blogId.equals(deletedBlog._id));
		await blogAuthor.save();
	} catch (err) {
		return res.status(500).json({
			error: 'error deleting blog'
		});
	}
	return res.json(deletedBlog.toJSON());
});

module.exports = router;