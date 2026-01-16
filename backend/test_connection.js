require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log("Testing URL:", connectionString.replace(/:[^:]*@/, ':****@'));

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

pool.connect().then(client => {
    console.log("SUCCESS: Connected to Database!");
    client.query('SELECT NOW()', (err, res) => {
        client.release();
        if (err) {
            console.error("Query Error:", err);
            return;
        }
        console.log("DB Time:", res.rows[0].now);
        process.exit(0);
    });
}).catch(err => {
    console.error("CONNECTION FAILED:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    process.exit(1);
});
