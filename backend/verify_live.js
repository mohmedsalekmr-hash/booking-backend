// Native fetch likely available


const BASE_URL = 'https://booking-backend-3nvh.onrender.com';

async function verify() {
    console.log(`Checking ${BASE_URL}...`);

    // 1. Health Check
    try {
        const resStats = await fetch(`${BASE_URL}/health`);
        console.log(`GET /health: ${resStats.status} ${resStats.statusText}`);
    } catch (e) {
        console.error("Health check failed:", e.message);
    }

    // 2. Debug Routes Check
    try {
        const resDebug = await fetch(`${BASE_URL}/debug-routes`);
        console.log(`GET /debug-routes: ${resDebug.status}`);
        if (resDebug.ok) {
            const data = await resDebug.json();
            console.log("Registered Routes:", data.routes);
        }
    } catch (e) {
        console.log("Debug route check failed:", e.message);
    }

    // 3. Bookings Endpoint
    try {
        const resBookings = await fetch(`${BASE_URL}/bookings`);
        console.log(`GET /bookings: ${resBookings.status} ${resBookings.statusText}`);
        if (resBookings.ok) {
            const data = await resBookings.json();
            console.log(`  > Found ${data.bookings ? data.bookings.length : 0} bookings.`);
        }
    } catch (e) {
        console.error("Bookings check failed:", e.message);
    }

    // 3. Create Test Booking (Optional, but confirms writes)
    const testBooking = {
        customer_name: "System Check",
        phone_number: "99999999",
        service_name: "Test Service",
        date: "2025-01-01", // Future date
        time: "10:00"
    };

    console.log("Attempting test booking...");
    try {
        const resBook = await fetch(`${BASE_URL}/book-appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testBooking)
        });
        console.log(`POST /book-appointment: ${resBook.status}`);

        if (resBook.status === 201) {
            console.log("  > Booking Created Successfully.");
        } else if (resBook.status === 409) {
            console.log("  > Booking Conflict (Expected if run twice).");
        } else {
            console.log("  > Error:", await resBook.text());
        }
    } catch (e) {
        console.error("Booking creation failed:", e.message);
    }
}

// Handle Node versions before 18 (no native fetch)
if (!global.fetch) {
    console.log("Node version too low for native fetch. Please use recent Node or install node-fetch.");
} else {
    verify();
}
