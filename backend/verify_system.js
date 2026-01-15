// Native fetch in Node 18+

const API_BASE_URL = 'https://booking-backend-3nvh.onrender.com';

async function testFlow() {
    console.log("🚀 Starting System Check (v3.0)...");

    // 1. Health Check
    try {
        const health = await fetch(`${API_BASE_URL}/health`);
        const healthText = await health.text();
        console.log(`✅ Health Check: [${health.status}] ${healthText}`);
    } catch (e) {
        console.error("❌ Health Check Failed:", e.message);
        return;
    }

    // 2. Get Available Slots (Today)
    const today = new Date().toISOString().split('T')[0];
    let selectedSlot = '';

    try {
        const slotsRes = await fetch(`${API_BASE_URL}/available-slots?date=${today}`);
        const slotsData = await slotsRes.json();
        console.log(`✅ Available Slots for ${today}:`, slotsData.availableSlots.length, "slots found.");

        if (slotsData.availableSlots.length > 0) {
            selectedSlot = slotsData.availableSlots[slotsData.availableSlots.length - 1]; // Pick last available
            console.log("   Selected Slot for Test:", selectedSlot);
        } else {
            console.log("⚠️ No slots available to test booking.");
        }
    } catch (e) {
        console.error("❌ Slots Check Failed:", e.message);
    }

    // 3. Dry Run Booking (We won't actually spam the DB unless we want to, but let's try one test booking if slot exists)
    if (selectedSlot) {
        const bookingPayload = {
            customer_name: "System Check Bot",
            phone_number: "22000000",
            service_name: "Integration Test",
            date: today,
            time: selectedSlot
        };

        try {
            console.log("🔄 Attempting Booking...");
            const bookRes = await fetch(`${API_BASE_URL}/book-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            const bookResult = await bookRes.json();

            if (bookRes.status === 201) {
                console.log("✅ Booking Successful:", bookResult);
            } else if (bookRes.status === 409) {
                console.log("⚠️ Booking Conflict (Expected if busy):", bookResult.error);
            } else {
                console.error("❌ Booking Failed:", bookResult);
            }
        } catch (e) {
            console.error("❌ Booking Error:", e.message);
        }
    }
}

testFlow();
