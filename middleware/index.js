const Comment = require('../models/comment');

/**********************************************************************
 *		authentication and authorization middlewares
***********************************************************************/

module.exports = {
	isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You need to login to do that.');
			res.redirect('/login');
		}
	}, 

	checkCommentOwnership (req, res, next) {
		if (req.isAuthenticated()) {
			const comment_id = req.params.comment_id;
			Comment.findById(comment_id)
				.then(comment => {
					if (comment.author.equals(req.user._id)) {
						next();
					} else {
						req.flash('error', 'Only the comment owner can do that.');
						res.redirect('back');
					}
				})
				.catch(err => {
					req.flash('error', 'Internal error 500');
					console.log('\x1b[33m%s\x1b[0m', err.message);
					return res.redirect('back');
				});
		} else {
			req.flash('error', 'You need to login do that.');
			res.redirect('/login');
		}
	}, 

	checkSiteOwnership (req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user && req.user.isSiteOwner) {
				next();
			} else {
				req.flash('error', 'You are not authorized to do that.');
				res.redirect('back');
			}
		} else {
			req.flash('error', 'You need to login do that.');
			res.redirect('back');
		}
	} 
};