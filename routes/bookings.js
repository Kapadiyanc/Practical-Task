let express = require('express');
let router = express.Router();
let bookingsCtrl = require('../controllers/bookings');

router
    .post('/booking', bookingsCtrl.booking)

module.exports = router;