const express = require('express');
const router = express.Router({ mergeParams: true });
const IndexController = require('../controllers/index_controller');

router.get('/', IndexController.portfolio);
router.post('/email', IndexController.email_me);
router.get('/register', IndexController.register_form);
router.post('/register', IndexController.register);
router.get('/login', IndexController.login_form);
router.post('/login', IndexController.login);
router.get('/logout', IndexController.logout);

module.exports = router;