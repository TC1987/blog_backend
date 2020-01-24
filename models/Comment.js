const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	blogId: {
		type: Schema.Types.ObjectId,
		ref: 'Blog'
	},
	comment: {
		type: String,
		required: true,
		minlength: 3
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	date: {
		type: Date,
		default: Date.now()
	},
	likes: {
		type: Number,
		default: 0
	}
});

commentSchema.set('toJSON', {
	transform: (doc, returned) => {
		returned.id = doc.id.toString();
		delete returned._id;
		delete returned.__v;
	}
});

module.exports = mongoose.model('Comment', commentSchema);