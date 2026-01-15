const db = require('../config/database');

const WORKING_HOURS = {
    start: 10, // 10 AM
    end: 19    // 7 PM
};

// Generate fixed hourly slots for simplicity
const generateSlots = () => {
    const slots = [];
    for (let i = WORKING_HOURS.start; i < WORKING_HOURS.end; i++) {
        const hour = i < 10 ? `0${i}` : i;
        slots.push(`${hour}:00`);
        // Optional: Add half-hour slots e.g. `${hour}:30`
    }
    return slots;
};

const getAvailableSlots = (date) => {
    return new Promise((resolve, reject) => {
        // Get all booked times for the date
        db.all('SELECT time FROM appointments WHERE date = ?', [date], (err, rows) => {
            if (err) {
                return reject(err);
            }
            const bookedTimes = rows.map(row => row.time);
            const allSlots = generateSlots();
            const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
            resolve(availableSlots);
        });
    });
};

const checkDoubleBooking = (date, time) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM appointments WHERE date = ? AND time = ?', [date, time], (err, row) => {
            if (err) return reject(err);
            resolve(!!row);
        });
    });
};

const checkDailyLimit = (phone, date) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM appointments WHERE phone_number = ? AND date = ?', [phone, date], (err, row) => {
            if (err) return reject(err);
            resolve(!!row);
        });
    });
};

const createAppointment = async (bookingData) => {
    const { customer_name, phone_number, service_name, date, time } = bookingData;

    // These checks are usually done by the controller or previous steps, but good to have here
    const isBooked = await checkDoubleBooking(date, time);
    if (isBooked) {
        throw new Error('Time slot already booked');
    }

    const hasBookingToday = await checkDailyLimit(phone_number, date);
    if (hasBookingToday) {
        throw new Error('Customer already has a booking for this date');
    }

    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
      INSERT INTO appointments (customer_name, phone_number, service_name, date, time)
      VALUES (?, ?, ?, ?, ?)
    `);

        stmt.run([customer_name, phone_number, service_name, date, time], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, ...bookingData });
        });
        stmt.finalize();
    });
};

const getDailyReport = (date) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM appointments WHERE date = ? ORDER BY time ASC', [date], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getAvailableSlots,
    createAppointment,
    getDailyReport
};
