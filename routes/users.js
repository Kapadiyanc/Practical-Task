let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/users');

router
    .post('/signup', userCtrl.signup)
    .post('/login', userCtrl.login)
    .get('/verify-email', userCtrl.verifyEmail)

module.exports = router;