const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: {
		type: String,
		required: true,
		minlength: 3
	},
	content: {
		type: String,
		required: true,
		minlength: 3
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