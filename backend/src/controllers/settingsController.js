const settingsService = require('../services/settingsService');

const getSettings = async (req, res) => {
    try {
        const settings = await settingsService.getSettings();
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const newSettings = req.body;
        // Basic Validation
        if (!newSettings || typeof newSettings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings data' });
        }

        await settingsService.updateSettings(newSettings);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
