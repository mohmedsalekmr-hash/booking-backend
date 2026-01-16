const settingsService = require('./src/services/settingsService');
const appointmentService = require('./src/services/appointmentService');
const db = require('./src/config/database');

const runVerification = async () => {
    console.log("Starting Stabilization Verification...");

    // 1. Force Update Settings to desired Defaults
    const defaults = {
        'opening_time': '09:00',
        'closing_time': '00:00',
        'break_start': '15:00',
        'break_end': '16:00',
        'slot_duration': '60',
        'preparation_time': '0'
    };

    try {
        await settingsService.updateSettings(defaults);
        console.log("Settings updated to defaults.");

        // 2. Fetch Slots for a future date (to avoid "past time" filtering)
        const date = '2030-01-01';
        const result = await appointmentService.getAvailableSlots(date);

        console.log(`Slots for ${date}:`);

        let found09 = false;
        let found15 = false; // Should be break
        let found23 = false;
        let found00 = false;

        result.slots.forEach(s => {
            // console.log(`${s.time} - ${s.status}`);
            if (s.time === '09:00') found09 = true;
            if (s.time === '15:00' && s.status === 'break') found15 = true;
            if (s.time === '23:00' && s.status === 'available') found23 = true;
            if (s.time === '00:00') found00 = true;
        });

        if (found09 && found15 && found23 && !found00) {
            console.log("SUCCESS: Slots generated correctly.");
            console.log("- 09:00 Found");
            console.log("- 15:00 Break Found");
            console.log("- 23:00 Found");
            console.log("- 00:00 Not Found (Correctly stops at midnight)");
            process.exit(0);
        } else {
            console.error("FAILURE: Incorrect slot generation.");
            if (!found09) console.error("Missing 09:00");
            if (!found15) console.error("Missing/Wrong 15:00");
            if (!found23) console.error("Missing 23:00");
            if (found00) console.error("Found 00:00 (Should stop)");
            console.log("Actual Slots:", result.slots.map(s => `${s.time}(${s.status})`));
            process.exit(1);
        }

    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
};

// Wait for DB init
setTimeout(runVerification, 1000);
