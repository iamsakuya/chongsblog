const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
	title: {
		type: String, 
		required: true, 
		unique: true 
	}, 
	body: {
		type: String, 
		required: true 
	}, 
	abstract: {
		type: String, 
		required: true 
	}, 
	thumbnail: {
		type: String 
	}, 
	created_date: {
		type: Date, 
		default: Date.now 
	}, 
	tags: {
		type: [String] 
	}, 
	comments: [{
		type: Schema.Types.ObjectId, 
		ref: 'comment' 
	}] 
});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;