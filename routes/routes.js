const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const usersRouter = require('./users');
const bookingsRouter = require('./bookings');

router.use('/user', usersRouter);
router.use('/booking', auth, bookingsRouter);

module.exports = router;