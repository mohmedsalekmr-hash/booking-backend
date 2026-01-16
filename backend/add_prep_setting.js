const db = require('./src/config/database');

db.serialize(() => {
    const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    insert.run('preparation_time', '0');
    insert.finalize((err) => {
        if (err) console.error(err);
        else console.log('Added preparation_time setting.');
    });
});
