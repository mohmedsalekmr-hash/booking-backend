require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('supabase');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

console.log(`[DB] Connecting to PostgreSQL/Supabase...`);

pool.connect((err, client, release) => {
    if (err) {
        return console.error('[DB] Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('[DB] Error executing query', err.stack);
        }
        console.log('[DB] Connected successfully to Supabase (PostgreSQL). Server Time:', result.rows[0].now);
    });
});

// Seed Logic (Wrapped in a function to be called explicitly or on start)
const seedDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(`CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            customer_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            service_name TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await client.query(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )`);

        const res = await client.query('SELECT count(*) as count FROM settings');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Seeding default settings...');
            const defaults = {
                'opening_time': '21:00',
                'closing_time': '23:00',
                'break_start': '15:00',
                'break_end': '16:00',
                'slot_duration': '60'
            };
            for (const [key, value] of Object.entries(defaults)) {
                await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value]);
            }
            console.log('Settings seeded.');
        }

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('[DB] Seeding Error:', e);
    } finally {
        client.release();
    }
};

// Auto-seed on start
seedDatabase();

module.exports = pool;
