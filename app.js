/**********************************************************************
 *		import libraries
***********************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const methodOverride = require('method-override');
const seed_db = require('./seed_db');


/**********************************************************************
 *		setup mongoose 
***********************************************************************/

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
	mongoose.connect('mongodb://localhost/noteblog');
}


/**********************************************************************
 *		setup express app
***********************************************************************/

const app = express();
if (process.env.NODE_ENV === 'test') {
	app.use(bodyParser.json())
} else {
	app.use(bodyParser.urlencoded({ extended: true }));
}
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


/**********************************************************************
 *		moment js setup
***********************************************************************/

app.locals.moment = require('moment');


/**********************************************************************
 *		passport setup
***********************************************************************/

app.use(require('express-session')({
	secret: 'There is no cute dogs in the world, cats are the best!', 
	resave: false, 
	saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});


/**********************************************************************
 *		connect flash setup
***********************************************************************/

app.use(flash());
app.use(function (req, res, next) {
	res.locals.error_msg = req.flash('error');
	res.locals.success_msg = req.flash('success');
	next();
});


/**********************************************************************
 *		seed databse
***********************************************************************/
//seed_db.reset_db();


/**********************************************************************
 *		setup routes
***********************************************************************/

const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blogs');
const commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);

app.all('*', (req, res) => {
	res.render('not_found');
});


/**********************************************************************
 *		setup error handler (must be the last middleware)
***********************************************************************/

app.use(function (err, req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', err);
	res.status(500);
	return res.render('error');
});


/**********************************************************************
 *		start express app
***********************************************************************/

app.listen(process.env.PORT || 3000, () => {
	if (process.env.PORT) {
		console.log('process.env.PORT available !');
		console.log('noteblog starts serving on port ' + process.env.PORT + ' ...');
	} else {
		console.log('process.env.PORT not available.');
		console.log('noteblog starts serving on port 3000 ...');
	}
});
