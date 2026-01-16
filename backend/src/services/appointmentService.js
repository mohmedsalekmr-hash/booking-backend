const db = require('../utils/dbAsync');
const settingsService = require('./settingsService');

// Helper to generate slots
const generateSlots = (startStr, endStr, durationMins) => {
    const slots = [];
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    let current = new Date(2000, 0, 1, startH, startM);
    // Handle overnight hours (e.g. 23:00 to 02:00)
    let end = new Date(2000, 0, 1, endH, endM);

    if (end <= current) {
        end.setDate(end.getDate() + 1);
    }

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
        // settingsService.getSettings is now synchronous but marked as async in export? 
        // Actually I removed async from getSettings in my previous edit, but let's await it just in case it returns a promise (it doesn't, but safety).
        // Wait, I made it synchronous. So I can just call it.
        // However, to avoid breaking if someone changes it back or purely for consistent async flow:
        const settings = await settingsService.getSettings();

        const startStr = settings.opening_time || '09:00';
        const endStr = settings.closing_time || '23:00';
        const breakStart = settings.break_start || '15:00';
        const breakEnd = settings.break_end || '16:00';
        const duration = parseInt(settings.slot_duration || '60');
        const prepTime = parseInt(settings.preparation_time || '0');

        const allSlots = generateSlots(startStr, endStr, duration);

        // Get Bookings
        const rows = await db.all('SELECT time FROM appointments WHERE date = ?', [date]);
        const bookedTimes = rows.map(r => r.time);

        // Map Bookings to Intervals
        const timeToMins = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const bookingIntervals = bookedTimes.map(t => {
            const start = timeToMins(t);
            const end = start + duration + prepTime;
            return { start, end };
        });

        // Current Server Time Check
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
        // Or if we trust the input date format
        let validSlots = allSlots;

        // Simple "is Today" check
        const now = new Date();
        const currentIsoDate = now.toLocaleDateString('en-CA');

        if (date === currentIsoDate) {
            const currentMins = now.getHours() * 60 + now.getMinutes();
            validSlots = validSlots.filter(slot => timeToMins(slot) > currentMins);
        }

        const slotsWithStatus = validSlots.map(slot => {
            let status = 'available';
            const slotStart = timeToMins(slot);
            const slotEnd = slotStart + duration;

            // 1. Check Break
            const bStart = timeToMins(breakStart);
            const bEnd = timeToMins(breakEnd);

            // Break logic: if the slot touches the break at all? 
            // Usually if it starts inside break or ends inside break or encompasses break.
            // Strict intersection:
            if (Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd)) {
                status = 'break';
            }

            // 2. Check Bookings
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

const checkDoubleBooking = async (date, time) => {
    const row = await db.get('SELECT id FROM appointments WHERE date = ? AND time = ?', [date, time]);
    return !!row;
};

const checkDailyLimit = async (phone, date) => {
    return await db.get('SELECT id, time FROM appointments WHERE phone_number = ? AND date = ?', [phone, date]);
};

const createAppointment = async (bookingData) => {
    const { customer_name, phone_number, service_name, date, time } = bookingData;

    const settings = await settingsService.getSettings();
    const breakStart = settings.break_start || '15:00';
    const breakEnd = settings.break_end || '16:00';
    const duration = parseInt(settings.slot_duration || '60');
    const prepTime = parseInt(settings.preparation_time || '0');

    const timeToMins = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const bookingStart = timeToMins(time);
    const bookingEnd = bookingStart + duration;

    // 1. Check Break Collision
    const bStart = timeToMins(breakStart);
    const bEnd = timeToMins(breakEnd);
    if (Math.max(bookingStart, bStart) < Math.min(bookingEnd, bEnd)) {
        throw new Error('This time slot overlaps with a break');
    }

    // 2. Check Existing Bookings Collision
    const dayBookings = await db.all('SELECT time FROM appointments WHERE date = ?', [date]);

    for (const row of dayBookings) {
        const existingStart = timeToMins(row.time);
        const existingEnd = existingStart + duration + prepTime;
        const newEndWithPrep = bookingEnd + prepTime;

        if (bookingStart < existingEnd && existingStart < newEndWithPrep) {
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

    const result = await db.run(`
      INSERT INTO appointments (customer_name, phone_number, service_name, date, time)
      VALUES (?, ?, ?, ?, ?) RETURNING id
    `, [customer_name, phone_number, service_name, date, time]);

    return { id: result.id, ...bookingData };
};

const getDailyReport = async (date) => {
    return await db.all('SELECT * FROM appointments WHERE date = ? ORDER BY time ASC', [date]);
};

const getAllAppointments = async () => {
    return await db.all('SELECT * FROM appointments ORDER BY date DESC, time ASC');
};

const deleteAppointment = async (id) => {
    const result = await db.run('DELETE FROM appointments WHERE id = ?', [id]);
    return { deleted: result.changes };
};

module.exports = {
    getAvailableSlots,
    createAppointment,
    deleteAppointment,
    getDailyReport,
    getAllAppointments
};
