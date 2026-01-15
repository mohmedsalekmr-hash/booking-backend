const appointmentService = require('../services/appointmentService');
const { isValidPhoneNumber, isValidDate, isValidTime } = require('../utils/validators');

const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || !isValidDate(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const slots = await appointmentService.getAvailableSlots(date);
        res.json({ date, availableSlots: slots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { customer_name, phone_number, service_name, date, time } = req.body;

        // Basic Validation
        if (!customer_name || !phone_number || !service_name || !date || !time) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!isValidPhoneNumber(phone_number)) {
            return res.status(400).json({ error: 'Invalid phone number. Must be exactly 8 digits.' });
        }

        if (!isValidDate(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        if (!isValidTime(time)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:MM.' });
        }

        const booking = await appointmentService.createAppointment({
            customer_name,
            phone_number,
            service_name,
            date,
            time
        });

        res.status(201).json({ message: 'Appointment booked successfully', booking });
    } catch (error) {
        console.error(error);
        if (error.message === 'Time slot already booked') {
            return res.status(409).json({ error: 'This time slot is already booked.' });
        }
        if (error.message === 'Customer already has a booking for this date') {
            return res.status(409).json({ error: 'You can only book one appointment per day.' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || !isValidDate(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const bookings = await appointmentService.getDailyReport(date);
        res.json({ date, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await appointmentService.getAllAppointments();
        res.json({ count: bookings.length, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAvailableSlots,
    bookAppointment,
    getDailyReport,
    getAllBookings
};
