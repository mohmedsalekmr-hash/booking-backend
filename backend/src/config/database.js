const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Fallback to /tmp for Render/Linux (Guaranteed writable, but ephemeral)
const dbPath = process.env.APPDATA
    ? path.join(process.env.APPDATA, 'BarberApp', 'appointments.db')
    : path.join('/tmp', 'appointments.db');
// Using /tmp ensures the server starts without 500 Permissions Errors.

console.log(`[DB] Initialize: Using database file at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // 1. Enable WAL Mode (Critical for concurrency)
        db.run('PRAGMA journal_mode = WAL;', (err) => {
            if (err) console.error("Failed to enable WAL:", err);
            else console.log("WAL mode enabled.");
        });

        // 2. Set Busy Timeout (Critical for locking issues)
        db.run('PRAGMA busy_timeout = 5000;', (err) => {
            if (err) console.error("Failed to set busy_timeout:", err);
        });
    }
});

// Seed Logic inside serialize to ensure order
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    service_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )`);

    // Check and Seed Settings
    db.get('SELECT count(*) as count FROM settings', (err, row) => {
        if (err) console.error("Error checking settings:", err);
        else if (row && row.count === 0) {
            console.log('Seeding default settings...');
            const defaults = {
                'opening_time': '21:00', // 9:00 PM
                'closing_time': '23:00', // 11:00 PM
                'break_start': '15:00',
                'break_end': '16:00',
                'slot_duration': '60'
            };
            const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
            for (const [key, value] of Object.entries(defaults)) {
                insert.run(key, value);
            }
            insert.finalize();
            console.log('Settings seeded.');
        }
    });
});

// Handle Process Exit to close DB connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

module.exports = db;
