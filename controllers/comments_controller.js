const Blog = require('../models/blog');
const Comment = require('../models/comment');

module.exports = {
	create (req, res) {
		var blog_id = req.params.id;
		var user_id = req.user.id;
		var user_name = req.user.name;
		var comment_body = req.body.body.trim();
		if ((!comment_body) || comment_body.length <= 0 || comment_body.length > 150) {
			req.flash('error', 'Missing comment content or comment over 150 characters.');
			console.log('\x1b[33m%s\x1b[0m', 'missing comment body or comment too long.');
			res.redirect('back');
			return ;
		}
		if (!(blog_id && user_id && user_name)) {
			req.flash('error', 'Missing required information.');
			console.log('\x1b[33m%s\x1b[0m', 'missing credentials.');
			res.redirect('back');
			return ;
		}
		Blog.findById(blog_id)
			.then(blog => {
				var comment = new Comment({
					author: user_id, 
					author_name: user_name, 
					body: comment_body 
				});
				Comment.create(comment)
					.then(comment => {
						blog.comments.push(comment);
						blog.save()
							.then(blog => {
								req.flash('success', 'Comment has been created.');
								res.redirect('/blogs/' + blog._id);
								return ;
							})
							.catch(err => {
								req.flash('error', 'Internal error.');
								console.log('\x1b[31m%s\x1b[0m', err.body.message);
								res.redirect('back');
								return ;
							});
					})
					.catch(err => {
						req.flash('error', 'Internal error.');
						console.log('\x1b[31m%s\x1b[0m', err.body.message);
						res.redirect('back');
						return ;
					});
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/blogs?page=1');
				return ;
			});
	}, 

	delete (req, res) {
		const blog_id = req.params.id;
		const comment_id = req.params.comment_id;
		Comment.findById(comment_id)
			.then(comment => {
				Blog.findById(blog_id)
					.then(blog => {
						blog.comments.remove(comment);
						blog.save()
							.then(() => {
								Comment.findByIdAndRemove(comment._id)
									.then(() => {
										req.flash('success', 'Comment has been deleted.');
										return res.redirect('/blogs/' + blog._id);
									})
									.catch(err => {
										req.flash('error', 'Internal error.');
										console.log('\x1b[31m%s\x1b[0m', err);
										return res.redirect('back');
									});
							})
							.catch(err => {
								req.flash('error', 'Internal error.');
								console.log('\x1b[31m%s\x1b[0m', err);
								return res.redirect('back');
							});
					})
					.catch(err => {
						req.flash('error', 'Internal error.');
						console.log('\x1b[31m%s\x1b[0m', err);
						return res.redirect('back');
					});
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err);
				return res.redirect('back');
			});
	} 
}