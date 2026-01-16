const db = require('../utils/dbAsync');

const getSettings = async () => {
    try {
        const rows = await db.all('SELECT key, value FROM settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.key] = row.value;
        });
        return settings;
    } catch (err) {
        console.error('Error getting settings:', err);
        throw err;
    }
};

const updateSettings = async (newSettings) => {
    const keys = Object.keys(newSettings);
    if (keys.length === 0) return {};

    try {
        // We can't easily use a transaction with Promise wrapper without a dedicated specific wrapper for it,
        // but for settings, running sequentially is fine.
        const query = 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)';

        for (const key of keys) {
            await db.run(query, [key, newSettings[key]]);
        }
        return newSettings;
    } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
    }
};

module.exports = {
    getSettings,
    updateSettings
};
