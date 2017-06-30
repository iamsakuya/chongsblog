const assert = require('assert');
const supertest = require('supertest');
const Blog = require('../models/blog');
const request = supertest('http://localhost:3000');

describe('blogs_controller', () => {
	it('post to /blogs create new blog', done => {
		request.post('/blogs')
			.send({
				title: 'test blog title', 
				body: '<h1>test blog body</h1>', 
				tags: 'tag1, tag2, tag3' 
			})
			.end((err, response) => {
				Blog.count()
					.then(count => {
						assert(count === 1);
						done();
					});
			});
	});
});