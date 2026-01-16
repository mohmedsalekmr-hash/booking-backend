const settingsService = require('./src/services/settingsService');
const db = require('./src/config/database');

const runVerification = async () => {
    console.log("Starting Verification...");

    // Wait for DB connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    const testSettings = {
        'opening_time': '08:00',
        'closing_time': '22:00',
        'preparation_time': '20'
    };

    try {
        console.log("Updating settings...");
        await settingsService.updateSettings(testSettings);
        console.log("Update call finished.");

        console.log("Fetching settings...");
        const settings = await settingsService.getSettings();
        console.log("Fetched Settings:", settings);

        const allMatch = Object.keys(testSettings).every(key => settings[key] === testSettings[key]);

        if (allMatch) {
            console.log("SUCCESS: All settings match!");
            process.exit(0);
        } else {
            console.error("FAILURE: Settings do not match.");
            process.exit(1);
        }

    } catch (error) {
        console.error("ERROR during verification:", error);
        process.exit(1);
    }
};

runVerification();
