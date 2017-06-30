const express = require('express');
const router = express.Router({ mergeParams: true });
const BlogController = require('../controllers/blogs_controller');
const middleware = require('../middleware');

/* index route, display all blogs */
router.get('/', BlogController.index);

/* create route, store new blog into db */
router.post('/', middleware.checkSiteOwnership, BlogController.create);

/* new route, show the form to create a new blog */
router.get('/new', middleware.checkSiteOwnership, BlogController.new);

/* show route, show detail of a blog */
router.get('/:id', BlogController.show);

/* edit route, show form to update an existing blog */
router.get('/:id/edit', middleware.checkSiteOwnership, BlogController.edit);

/* update route, update an existing blog in db */
router.put('/:id', middleware.checkSiteOwnership, BlogController.update);

/* delete route, delete an existing blog in db */
router.delete('/:id', middleware.checkSiteOwnership, BlogController.delete);

module.exports = router;