const assert = require('assert');
const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('noteblog app', () => {
	it('handles get request at the route get /', done => {
		request.get('/')
			.end((err, response) => {
				assert(response.status === 200);
				done();
			});
	});
});