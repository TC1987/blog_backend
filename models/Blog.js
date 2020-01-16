const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	likes: {
		type: Number,
		default: 0
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	views: {
		type: Number,
		default: 0
	},
	tags: [String],
	readTime: String,
	pictureUrl: String
}, {
	timestamps: true
});

blogSchema.set('toJSON', {
	transform: (document, returned) => {
		returned.id = document._id;
		delete returned._id;
		delete returned.__v;
	}
});

module.exports = mongoose.model('Blog', blogSchema);