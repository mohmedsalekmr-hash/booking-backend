const db = require('../config/database');
const settingsService = require('./settingsService');

// Helper to generate slots
const generateSlots = (startStr, endStr, durationMins) => {
    const slots = [];
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    let current = new Date(2000, 0, 1, startH, startM);
    const end = new Date(2000, 0, 1, endH, endM);

    while (current < end) {
        const h = current.getHours().toString().padStart(2, '0');
        const m = current.getMinutes().toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        current.setMinutes(current.getMinutes() + durationMins);
    }
    return slots;
};

const getAvailableSlots = async (date) => {
    try {
        const settings = await settingsService.getSettings();
        const startStr = settings.opening_time || '09:00';
        const endStr = settings.closing_time || '23:00';
        const breakStart = settings.break_start || '15:00';
        const breakEnd = settings.break_end || '16:00';
        const duration = parseInt(settings.slot_duration || '60');
        const prepTime = parseInt(settings.preparation_time || '0');

        const allSlots = generateSlots(startStr, endStr, duration);

        // Get Bookings
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT time FROM appointments WHERE date = ?', [date], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        const bookedTimes = rows.map(r => r.time);

        // Map Bookings to Intervals (Minutes from Midnight)
        const timeToMins = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const bookingIntervals = bookedTimes.map(t => {
            const start = timeToMins(t);
            const end = start + duration + prepTime; // Occupies slot + prep
            return { start, end };
        });

        // Filter Past Time if Today
        const todayStr = new Date().toISOString().split('T')[0];
        let validSlots = allSlots;

        if (date === todayStr) {
            const now = new Date();
            const currentHour = now.getUTCHours();
            const currentMin = now.getUTCMinutes();
            const currentMins = currentHour * 60 + currentMin;

            validSlots = validSlots.filter(slot => timeToMins(slot) > currentMins);
        }

        // Map to Status Objects
        const slotsWithStatus = validSlots.map(slot => {
            let status = 'available';
            const slotStart = timeToMins(slot);
            const slotEnd = slotStart + duration; // Slot occupies its own duration (overlap check)

            // 1. Check Break
            // Break is a fixed range [breakStart, breakEnd)
            const bStart = timeToMins(breakStart);
            const bEnd = timeToMins(breakEnd);
            // Overlap logic: StartA < EndB && StartB < EndA
            if (slotStart < bEnd && bStart < slotEnd) {
                status = 'break';
            }

            // 2. Check Bookings (Collision)
            if (status !== 'break') {
                for (const booking of bookingIntervals) {
                    if (slotStart < booking.end && booking.start < slotEnd) {
                        status = 'booked';
                        break;
                    }
                }
            }

            return { time: slot, status };
        });

        return { slots: slotsWithStatus };

    } catch (error) {
        throw error;
    }
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
        db.get('SELECT id, time FROM appointments WHERE phone_number = ? AND date = ?', [phone, date], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const createAppointment = async (bookingData) => {
    const { customer_name, phone_number, service_name, date, time } = bookingData;

    // Validate against Settings
    const settings = await settingsService.getSettings();
    const breakStart = settings.break_start || '15:00';
    const breakEnd = settings.break_end || '16:00';
    const duration = parseInt(settings.slot_duration || '60');
    const prepTime = parseInt(settings.preparation_time || '0');

    // Time to Mins Helper
    const timeToMins = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const bookingStart = timeToMins(time);
    const bookingEnd = bookingStart + duration;

    // 1. Check Break Collision
    const bStart = timeToMins(breakStart);
    const bEnd = timeToMins(breakEnd);
    if (bookingStart < bEnd && bStart < bookingEnd) {
        throw new Error('This time slot overlaps with a break');
    }

    // 2. Check Existing Bookings Collision
    // We need to fetch ALL bookings for the day to check intervals
    const dayBookings = await new Promise((resolve, reject) => {
        db.all('SELECT time FROM appointments WHERE date = ?', [date], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    for (const row of dayBookings) {
        const existingStart = timeToMins(row.time);
        // Existing booking occupies: [start, start + duration + prep]
        // Note: We assume all bookings have same duration/prep from current settings. 
        // Ideally we should store duration per booking, but this is a simplified system.
        const existingEnd = existingStart + duration + prepTime;

        // Check Overlap: StartA < EndB && StartB < EndA
        // New Booking Interval: [bookingStart, bookingEnd]
        // Existing Interval: [existingStart, existingEnd]

        // Also need to check if New Booking + Prep overlaps with Existing?
        // Actually, the buffer is usually "After" the booking. 
        // So New Booking shouldn't start during Existing+Buffer.
        // AND Existing shouldn't start during New+Buffer?
        // Let's assume Buffer is "Cleanup after service". 
        // So New Booking occupies [Start, Start+Duration+Prep].
        // Overlap condition:
        const newEndWithPrep = bookingEnd + prepTime;

        // Strict Collision: A.Start < B.End AND B.Start < A.End
        if (bookingStart < existingEnd && existingStart < newEndWithPrep) { // Check both ways
            throw new Error('Time slot overlaps with an existing booking');
        }
    }

    const existingBooking = await checkDailyLimit(phone_number, date);
    if (existingBooking) {
        const error = new Error('Customer already has a booking for this date');
        error.code = 'daily_limit';
        error.existingTime = existingBooking.time;
        throw error;
    }

    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
      INSERT INTO appointments (customer_name, phone_number, service_name, date, time)
      VALUES (?, ?, ?, ?, ?)
    `);

        stmt.run([customer_name, phone_number, service_name, date, time], function (err) {
            stmt.finalize();
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
        const query = `SELECT * FROM appointments ORDER BY date DESC, time ASC`;
        db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const deleteAppointment = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM appointments WHERE id = ?', [id], function (err) {
            if (err) return reject(err);
            resolve({ deleted: this.changes });
        });
    });
};

module.exports = {
    getAvailableSlots,
    createAppointment,
    deleteAppointment,
    getDailyReport,
    getAllAppointments
};
