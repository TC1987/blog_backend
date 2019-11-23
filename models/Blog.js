const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: String,
	content: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

blogSchema.set('toJSON', {
	transform: (document, returned) => {
		returned.id = document._id;
		delete returned._id;
		delete returned.__v;
	}
});

module.exports = mongoose.model('Blog', blogSchema);