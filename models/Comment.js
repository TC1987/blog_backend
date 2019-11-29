const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	postId: {
		type: Schema.Types.ObjectId,
		ref: 'Blog'
	},
	comment: String,
	comments: {
		type: [Schema.Types.ObjectId],
		ref: 'Comment'
	},
	author: {
		type: String,
		default: 'Anonymous'
	},
	date: {
		type: Date,
		default: Date.now()
	},
});

module.exports = mongoose.model('Comment', commentSchema);