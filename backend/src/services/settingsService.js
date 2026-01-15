const db = require('../config/database');

const getSettings = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT key, value FROM settings', (err, rows) => {
            if (err) return reject(err);
            const settings = {};
            rows.forEach(row => {
                settings[row.key] = row.value;
            });
            resolve(settings);
        });
    });
};

const updateSettings = (newSettings) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            let completed = 0;
            const keys = Object.keys(newSettings);

            if (keys.length === 0) {
                db.run('COMMIT');
                return resolve({});
            }

            keys.forEach(key => {
                stmt.run(key, newSettings[key], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                });
            });

            stmt.finalize(() => {
                db.run('COMMIT', (err) => {
                    if (err) return reject(err);
                    resolve(newSettings);
                });
            });
        });
    });
};

module.exports = {
    getSettings,
    updateSettings
};
