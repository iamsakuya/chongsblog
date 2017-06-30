const User = require('../models/user');
const passport = require("passport");

module.exports = {
	portfolio (req, res) {
		res.render('landing');
	}, 

	email_me (req, res) {
		res.render('not_found');
	}, 

	register_form (req, res) {
		res.render('register');
	}, 

	register (req, res) {
		var name = req.body.username;
		var email = req.body.email;
		var password = req.body.password;

		/* validate inputs (needs improve later) */
		if (!(name && email && password)) {
			req.flash('error', 'Required field is missing.');
			console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: required field missing.');
			res.redirect('back');
			return ;
		}
		if (name.toLowerCase() === 'chong' || name.toLowerCase() === 'admin' || name.toLowerCase() === 'root') {
			req.flash('error', 'Invaid username or email.');
			console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: invalid username.');
			res.redirect('back');
			return ;
		}
		if (email.length < 6) {
			req.flash('error', 'Invaid email.');
			console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: email too short.');
			res.redirect('back');
			return ;
		}
		if (name.length < 3 || name.length > 15) {
			req.flash('error', 'Invaid username: username must be greater than 3 and less than 15.');
			console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: username length invalid.');
			res.redirect('back');
			return ;
		}
		if (password.length < 4 || password.length > 64) {
			req.flash('error', 'Invaid username: password must be greater than 4 and less than 64.');
			console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: password length invalid.');
			res.redirect('back');
			return ;
		}

		User.count({ name: name })
			.then(name_count => {
				if (name_count !== 0) {
					req.flash('error', 'Username already exist.');
					console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: duplicate user name.');
					res.redirect('back');
				} else {
					User.count({ email: email })
						.then(email_count => {
							if (email_count !== 0) {
								req.flash('error', 'User email already exist.');
								console.log('\x1b[33m%s\x1b[0m', 'Error creating new user: duplicate user email address.');
								res.redirect('back');
							} else {
								const user = new User({
									name: name, 
									email: email 
								});
								User.register(user, password, (err, user) => {
									if (err) {
										req.flash('error', 'Internal error.');
										console.log('\x1b[31m%s\x1b[0m', 'Error registering new user: ');
										console.log('\x1b[31m%s\x1b[0m', err.errmsg);
										res.redirect('/register');
									} else {
										passport.authenticate('local')(req, res, () => {
											req.flash('success', 'Registration complete.');
											res.redirect('/blogs?page=1');
										});
									}
								});
							}
						});
				}
			})
			.catch(err => {
				req.flash('error', 'Internal error.');
				console.log('\x1b[31m%s\x1b[0m', err.body.message);
				res.redirect('/register');
			});
	}, 

	login_form (req, res) {
		res.render('login');
	}, 

	login (req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/blogs?page=1', 
			failureRedirect: '/login', 
			successFlash: 'Welcome back !', 
			failureFlash: 'Username or password is incorrect.' 
		})(req, res, next);
	}, 

	logout (req, res) {
		req.logout();
		req.flash('success', 'You have been logged out.');
		res.redirect("/blogs?page=1");
	} 
};
