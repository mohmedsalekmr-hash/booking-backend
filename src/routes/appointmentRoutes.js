const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/available-slots', appointmentController.getAvailableSlots);
router.post('/book-appointment', appointmentController.bookAppointment);
router.get('/daily-report', appointmentController.getDailyReport);
router.get('/bookings', appointmentController.getAllBookings);

module.exports = router;
