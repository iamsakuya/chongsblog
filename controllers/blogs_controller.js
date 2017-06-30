const Blog = require('../models/blog');
const Comment = require('../models/comment');
const striptags = require('striptags');

module.exports = {
	index (req, res) {
		const page = parseInt(req.query.page);
		const post_per_page = 2;
		Blog.find({})
			.sort('-created_date')
			.then(blogs => {
				if (page && page > 0 && (page - 1) * post_per_page < blogs.length) {
					const begin = (page - 1) * post_per_page;
					const end = begin + post_per_page;
					var blogs_after_skip = blogs.slice(begin, end);
					const prev_page = page - 1 > 0 ? page - 1 : false;
					const next_page = (page * post_per_page < blogs.length) ? page + 1 : false;
					res.render('blogs/index', {
						blogs: blogs_after_skip, 
						isPaged: true, 
						page: page, 
						prev_page: prev_page, 
						next_page: next_page 
					});
				} else {
					res.render('blogs/index', {
						blogs: blogs, 
						isPaged: false 
					});
				}
			})
			.catch(err => {
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/');
			});
	}, 

	new (req, res) {
		res.render('blogs/new');
	}, 

	create (req, res, next) {
		var title = req.body.title.trim();
		if (req.body.thumbnail) {
			var thumbnail = req.body.thumbnail;
		}
		var body = req.body.body.trim();
		if (!(title && body)) {
			req.flash('error', 'Missing blog title or body !');
			res.redirect('back');
		}
		var body_stripped = striptags(body);
		var abstract = (body_stripped && body_stripped.length > 0) ? body_stripped.substring(0, 90) : 'This blog contains no text.';
		var tags_str = req.body.tags.trim();
		var tags = tags_str ? tags_str.split(new RegExp('[ ]*,[ ]*')) : [];
		var blog = {
			title: title, 
			body: body, 
			thumbnail: thumbnail, 
			abstract: abstract, 
			tags: tags 
		};
		Blog.count({ title: title })
			.then(count => {
				if (count === 0) {
					Blog.create(blog)
						.then(blog => {
							req.flash('success', 'Blog has been created');
							res.redirect('/blogs?page=1');
						})
						.catch(err => {
							req.flash('error', err.body.message);
							console.log('\x1b[31m%s\x1b[0m', err.body.message);
							res.redirect('/blogs?page=1');
						});
				} else {
					req.flash('error', 'A blog with the same title already exists.');
					console.log('\x1b[33m%s\x1b[0m', 'Error creating new blog: duplicate blog title.');
					res.redirect('/blogs?page=1');
				}
			});
	}, 

	show (req, res) {
		var blog_id = req.params.id;
		Blog.findById(blog_id).populate('comments').exec()
			.then(blog => {
				res.render('blogs/show', { blog: blog });
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/blogs?page=1');
			});
	}, 

	edit (req, res) {
		var blog_id = req.params.id;
		Blog.findById(blog_id)
			.then(blog => {
				res.render('blogs/edit', { blog: blog });
			})
			.catch(err => {
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/blogs?page=1');
			});
	}, 

	update (req, res) {
		var id = req.params.id;
		var title = req.body.title.trim();
		if (req.body.thumbnail) {
			var thumbnail = req.body.thumbnail;
		}
		var body = req.body.body.trim();
		if (!(title && body)) {
			req.flash('error', 'Missing blog title or body !');
			res.redirect('back');
		}
		var body_stripped = striptags(body);
		var abstract = (body_stripped && body_stripped.length > 0) ? body_stripped.substring(0, 90) : 'This blog contains no text.';
		var tags_str = req.body.tags.trim();
		var tags = tags_str ? tags_str.split(new RegExp('[ ]*,[]*')) : [];
		var edited_blog = {
			title: title, 
			body: body, 
			thumbnail: thumbnail, 
			abstract: abstract, 
			tags: tags 
		};
		Blog.findByIdAndUpdate(id, edited_blog)
			.then(() => {
				req.flash('success', 'Blog has been updated.');
				res.redirect('/blogs/' + id);
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/blogs?page=1');
			});
	}, 

	delete (req, res) {
		var blog_id = req.params.id;
		Blog.findById(blog_id)
			.then(blog => {
				if (blog.comments && blog.comments.length > 0) {
					var comments = blog.comments;
					comments.forEach(comment => {
						Comment.findByIdAndRemove(comment)
							.catch(err => {
								req.flash('error', 'Internal error.');
								console.log('\x1b[31m%s\x1b[0m', err.body.message);
								res.redirect('/blogs?page=1');
							});
					});
					Blog.findByIdAndRemove(blog._id)
						.then(() => {
							req.flash('success', 'Blog has been deleted.');
							res.redirect('/blogs?page=1');
						})
						.catch(err => {
							req.flash('error', 'Internal error.');
							console.log('\x1b[31m%s\x1b[0m', err.body.message);
							res.redirect('/blogs?page=1');
						});
				} else {
					Blog.findByIdAndRemove(blog._id)
						.then(() => {
							req.flash('success', 'Blog has been deleted.');
							res.redirect('/blogs?page=1');
						})
						.catch(err => {
							req.flash('error', 'Internal error.');
							console.log('\x1b[31m%s\x1b[0m', err.body.message);
							res.redirect('/blogs?page=1');
						});
				}
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/blogs?page=1');
			});
	} 
};