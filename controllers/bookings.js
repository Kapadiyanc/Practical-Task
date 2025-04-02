const commonCtrl = require('./common');
const bookings = require('../models/bookings');
const validator = require('validator');
const { Op } = require('sequelize');

/* Created By : Nikunj Kapadiya
 * Create date : 02/04/2025
 * Description : Create new booking
*/

exports.booking = async (req, res) => {
    const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;

    let query = {
        booking_date: bookingDate,
        [Op.or]: [
            { booking_type: 'Full Day' },
            { booking_type: 'Half Day', booking_slot: bookingSlot },
            { booking_type: 'Custom', booking_time: bookingTime },
        ]
    };
    let select = ['id'];
    const existingBooking = await commonCtrl.getSingleData(bookings, query, select);

    if (existingBooking) {
        return res.status(400).json({ message: 'Duplicate booking found' });
    }

    try {

        let newBookingData = {
            customer_name: customerName,
            customer_email: customerEmail,
            booking_date: bookingDate,
            booking_type: bookingType,
            booking_slot: bookingSlot,
            booking_time: bookingTime,
            user_id: req.userId,
        };
        let result = await commonCtrl.createData(bookings, newBookingData);
        res.status(201).json({ message: 'Booking successfully created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}