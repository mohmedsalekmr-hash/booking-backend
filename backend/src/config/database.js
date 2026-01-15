const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../appointments.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    service_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Appointments table ready.');
        }
    });

    // Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating settings table:', err.message);
            return;
        }
        console.log('Settings table ready.');

        // Seed default settings if empty
        const defaults = {
            'opening_time': '09:00',
            'closing_time': '23:00',
            'break_start': '15:00',
            'break_end': '16:00',
            'slot_duration': '60'
        };

        const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
        for (const [key, value] of Object.entries(defaults)) {
            insert.run(key, value);
        }
        insert.finalize();
    });
});

module.exports = db;
