const db = require('../config/database');

const WORKING_HOURS = {
    start: 9, // 9 AM
    end: 22   // 10 PM (Loop goes < 22, so last slot is 21:00)
};

// Generate fixed hourly slots
const generateSlots = () => {
    const slots = [];
    for (let i = WORKING_HOURS.start; i < WORKING_HOURS.end; i++) {
        const hour = i < 10 ? `0${i}` : i;
        slots.push(`${hour}:00`);
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
            let allSlots = generateSlots();

            // Filter past times if date is today
            // Assuming Server Time (UTC) matches Shop Time (GMT/MRU)
            const todayStr = new Date().toISOString().split('T')[0];

            if (date === todayStr) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();

                allSlots = allSlots.filter(slot => {
                    const [slotHour, slotMin] = slot.split(':').map(Number);
                    if (slotHour < currentHour) return false;
                    if (slotHour === currentHour && slotMin < currentMin) return false;
                    return true;
                });
            }

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
            stmt.finalize(); // Finalize AFTER execution to avoid race conditions
            if (err) return reject(err);
            resolve({ id: this.lastID, ...bookingData });
        });
    });
};

// Get daily report
const getDailyReport = (date) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM appointments WHERE date = ? ORDER BY time ASC`;
        db.all(query, [date], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Get ALL appointments (for Admin)
const getAllAppointments = () => {
    return new Promise((resolve, reject) => {
        // Limit to reasonable amount? user asked for all. let's return all.
        const query = `SELECT * FROM appointments ORDER BY date DESC, time ASC`;
        db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getAvailableSlots,
    createAppointment,
    getDailyReport,
    getAllAppointments
};
