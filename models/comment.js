const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId, 
		ref: 'user' 
	}, 
	author_name: {
		type: String, 
		required: true 
	}, 
	body: {
		type: String, 
		required: true 
	}, 
	created_date: {
		type: Date, 
		default: Date.now 
	} 
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;