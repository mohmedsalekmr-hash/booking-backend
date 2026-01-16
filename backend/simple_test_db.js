const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

const dbPath = 'C:\\Users\\recor\\AppData\\Local\\Temp\\appointments_test.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("DB Error:", err);
    else console.log("DB Connected");
});

app.get('/health', (req, res) => {
    db.all("SELECT 1", (err, rows) => {
        if (err) res.status(500).send("DB Error");
        else res.send('Simple DB Server Working');
    });
});

app.listen(PORT, () => {
    console.log(`Simple DB Server log 1`);
});
