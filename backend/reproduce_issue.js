const API_BASE_URL = 'https://booking-backend-3nvh.onrender.com';

async function reproduceIssue() {
    console.log("🚀 Attempting to reproduce 'Haircut & Beard' issue...");

    // Use a unique phone number to avoid 'Customer already has a booking' error if possible, 
    // or just handle the 409 gracefully.
    const randomPhone = "22" + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split('T')[0];

    // 1. Get a slot first
    let selectedSlot = '10:00';
    try {
        const slotsRes = await fetch(`${API_BASE_URL}/available-slots?date=${today}`);
        const slotsData = await slotsRes.json();
        if (slotsData.availableSlots && slotsData.availableSlots.length > 0) {
            // Check if 10:00 is available, else pick random
            if (slotsData.availableSlots.includes('10:00')) selectedSlot = '10:00';
            else selectedSlot = slotsData.availableSlots[0];
            console.log(`Refreshed slot to: ${selectedSlot}`);
        } else {
            console.log("No slots available today. Cannot fully test booking.");
            return;
        }
    } catch (e) {
        console.error("Failed to fetch slots", e);
    }

    const payload = {
        customer_name: "Test User Ampersand",
        phone_number: randomPhone,
        service_name: "Haircut & Beard", // The suspected culprit
        date: today,
        time: selectedSlot
    };

    console.log("Sending payload:", JSON.stringify(payload));

    try {
        const start = Date.now();
        const response = await fetch(`${API_BASE_URL}/book-appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const duration = Date.now() - start;

        console.log(`Response received in ${duration}ms`);
        console.log("Status:", response.status);

        const text = await response.text();
        console.log("Body:", text);

    } catch (error) {
        console.error("❌ Request Failed/Timed Out:", error.message);
    }
}

reproduceIssue();
