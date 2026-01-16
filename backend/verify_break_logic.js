const settingsService = require('./src/services/settingsService');

const runCheck = async () => {
    try {
        // Attempt to set a break outside working hours programmatically to ensure backend doesn't reject it (it shouldn't, but good to check)
        // And check if defaults (if re-seeded) would correspond. 
        // Since we can't easily re-seed without deleting DB, we will just try to UPDATE to the target config.

        const targetConfig = {
            'opening_time': '21:00',
            'closing_time': '23:00',
            'break_start': '15:00',
            'break_end': '16:00'
        };

        console.log("Attempting to update settings to:", targetConfig);
        await settingsService.updateSettings(targetConfig);
        console.log("Settings updated successfully.");

        const settings = await settingsService.getSettings();
        console.log("Current Settings:", settings);

        if (settings.opening_time === '21:00' && settings.break_start === '15:00') {
            console.log("SUCCESS: Configuration accepted.");
        } else {
            console.error("FAILURE: Settings mismatch.");
            process.exit(1);
        }

    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
};

runCheck();
