const mongoose = require('mongoose');

before(done => {
	require('../app');
	mongoose.connect('mongodb://localhost/noteblog_test');
	mongoose.connection
		.once('open', () => done())
		.on('error', err => console.warn('Warning', error));
});

beforeEach(done => {
	Promise.all([
		new Promise((resolve, reject) => {
			const blogs  = mongoose.connection.collections.blogs;
			if (blogs) {
				console.log('droping collection noteblog_test.blogs ... ');
				blogs.drop()
					.then(() => {
						console.log('\x1b[34m%s\x1b[0m', 'noteblog_test.blogs has been droped');
						resolve();
					})
					.catch(err => {
						console.log('\x1b[33m%s\x1b[0m', 'error dropping noteblog_test.blogs: ');
						console.log('\x1b[33m%s\x1b[0m', err.message);
						reject();
					});
			} else {
				console.log('collection noteblog_test.blogs doesn\'t exist');
				resolve();
			}
		}), 
		new Promise((resolve, reject) => {
			const comments  = mongoose.connection.collections.comments;
			if(comments) {
				console.log('droping collection noteblog_test.comments ... ');
				comments.drop()
					.then(() => {
						console.log('\x1b[34m%s\x1b[0m', 'noteblog_test.comments has been droped');
						resolve();
					})
					.catch(err => {
						console.log('\x1b[33m%s\x1b[0m', 'error dropping noteblog_test.comments: ');
						console.log('\x1b[33m%s\x1b[0m', err.message);
						reject();
					});
			} else {
				console.log('collection noteblog_test.comments doesn\'t exist');
				resolve();
			}
		}), 
		new Promise((resolve, reject) => {
			if (users) {
				const users  = mongoose.connection.collections.users;
				console.log('droping collection noteblog_test.users ... ');
				users.drop()
					.then(() => {
						console.log('\x1b[34m%s\x1b[0m', 'noteblog_test.users has been droped');
						resolve();
					})
					.catch(err => {
						console.log('\x1b[33m%s\x1b[0m', 'error dropping noteblog_test.users: ');
						console.log('\x1b[33m%s\x1b[0m', err.message);
						reject();
					});
			} else {
				console.log('collection noteblog_test.users doesn\'t exist');
				resolve();
			}
		}) 
	]).then(() => done()).catch(() => done());
});