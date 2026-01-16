const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// SIMULATE LINUX / RENDER (No APPDATA)
delete process.env.APPDATA;

console.log("__dirname:", __dirname);
const dbPath = path.resolve(__dirname, 'src/config/../../appointments.db');
// Note: In real app, it calls from src/config/database.js, so __dirname is src/config.
// Here I am running from root, so I need to adjust or simulate exactly.

// Let's replicate the logic exactly as it is in database.js
// But we need to define __dirname as if we were inside src/config
const mockDirname = path.join(process.cwd(), 'backend', 'src', 'config');
console.log("Mock __dirname:", mockDirname);

const resolvedPath = path.resolve(mockDirname, '../../appointments.db');
console.log("Resolved DB Path:", resolvedPath);

try {
    const db = new sqlite3.Database(resolvedPath, (err) => {
        if (err) {
            console.error("FAIL: Could not open DB at", resolvedPath, err.message);
        } else {
            console.log("SUCCESS: Opened DB at", resolvedPath);
            db.run("CREATE TABLE IF NOT EXISTS test (id INT)", (e) => {
                if (e) console.log("FAIL: Create table", e);
                else console.log("SUCCESS: Create table");
            });
            db.close();
        }
    });
} catch (e) {
    console.error("CRITICAL EXCEPTION:", e);
}
