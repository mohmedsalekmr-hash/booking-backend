const http = require('http');
const https = require('https');

// ENDPOINTS
const LOCAL_API = 'http://localhost:3000';
const LIVE_API = 'https://booking-backend-3nvh.onrender.com';

// TEST DATA
const TEST_DATE = new Date().toISOString().split('T')[0];
const TEST_BOOKING = {
    customer_name: "Audit Test",
    phone_number: "99999999",
    service_name: "Audit Service",
    date: TEST_DATE,
    time: "21:00"
};

// HELPER: HTTP Request
const request = (url, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https');
        const lib = isHttps ? https : http;
        const opts = { method, headers: { 'Content-Type': 'application/json' } };

        const req = lib.request(url, opts, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, body: json });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

// AUDIT FUNCTION
const auditEnvironment = async (envName, baseUrl) => {
    console.log(`\n--- AUDITING: ${envName} (${baseUrl}) ---`);
    const report = { env: envName, checks: [] };

    try {
        // 1. Health Check
        try {
            const health = await request(`${baseUrl}/health`);
            report.checks.push({ name: 'Health Check', status: health.status === 200 ? 'PASS' : 'FAIL', details: health.body });
        } catch (e) {
            report.checks.push({ name: 'Health Check', status: 'FAIL', details: 'Connection Refused' });
            console.error("CRITICAL: Connection failed. Skipping rest of audit for " + envName);
            return report;
        }

        // 2. Get Settings
        const settings = await request(`${baseUrl}/settings`);
        report.checks.push({ name: 'Get Settings', status: settings.status === 200 ? 'PASS' : 'FAIL', details: settings.body });

        // 3. Get Slots
        const slots = await request(`${baseUrl}/available-slots?date=${TEST_DATE}`);
        report.checks.push({ name: 'Get Slots', status: slots.status === 200 ? 'PASS' : 'FAIL', details: `Slots found: ${slots.body.slots ? slots.body.slots.length : 0}` });

        // 4. Create Booking
        const booking = await request(`${baseUrl}/book-appointment`, 'POST', TEST_BOOKING);
        if (booking.status === 201) {
            report.checks.push({ name: 'Create Booking', status: 'PASS', details: `ID: ${booking.body.id}` });

            // 5. Verify Booking in List/Admin
            const list = await request(`${baseUrl}/bookings`);
            const found = list.body.bookings && list.body.bookings.find(b => b.id === booking.body.id);
            report.checks.push({ name: 'Verify Persistence', status: found ? 'PASS' : 'FAIL', details: found ? 'Found in DB' : 'Not found in DB' });

            // 6. Delete Test Booking
            if (found) {
                await request(`${baseUrl}/bookings/${booking.body.id}`, 'DELETE');
                console.log("Cleanup: Deleted test booking.");
            }

        } else if (booking.status === 409) {
            report.checks.push({ name: 'Create Booking', status: 'SKIP', details: 'Slot already booked (Conflict)' });
        } else {
            report.checks.push({ name: 'Create Booking', status: 'FAIL', details: booking.body });
        }

    } catch (error) {
        console.error("Audit Error:", error);
        report.checks.push({ name: 'General Error', status: 'FAIL', details: error.message });
    }

    return report;
};

// RUNNER
(async () => {
    const localReport = await auditEnvironment('LOCAL', LOCAL_API);
    const liveReport = await auditEnvironment('LIVE', LIVE_API);

    console.log("\n\n=== FINAL AUDIT REPORT ===");
    console.log(JSON.stringify({ local: localReport, live: liveReport }, null, 2));
})();
