const https = require('https');
const http = require('http');

// CONFIG
const LIVE_API = 'https://booking-backend-3nvh.onrender.com';
const LOCAL_API = 'http://localhost:3000';

const REQUIRED_SETTINGS = {
    opening_time: '21:00',
    closing_time: '23:00',
    break_start: '15:00',
    break_end: '16:00',
    slot_duration: '60',
    preparation_time: '0'
};

const updateSettings = (url, settings) => {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https');
        const lib = isHttps ? https : http;

        const data = JSON.stringify(settings);
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = lib.request(`${url}/settings`, opts, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

(async () => {
    console.log("--- FIXING LIVE SETTINGS ---");
    try {
        const res = await updateSettings(LIVE_API, REQUIRED_SETTINGS);
        console.log("Live Response:", res.status, res.body);

        if (res.status === 200) {
            console.log("SUCCESS: Live settings forced to match Local defaults.");
        } else {
            console.error("FAILURE: Could not update Live settings.");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
})();
