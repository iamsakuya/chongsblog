const express = require('express');
const router = express.Router({ mergeParams: true });
const CommentController = require('../controllers/comments_controller');
const middleware = require('../middleware');

router.post('/', middleware.isLoggedIn, CommentController.create);

router.delete('/:comment_id', middleware.checkCommentOwnership, CommentController.delete);

module.exports = router;