const startVerification = async () => {
    const baseUrl = 'http://localhost:3000';

    console.log('--- Starting Verification ---');

    // Test 1: Get Available Slots
    try {
        const response = await fetch(`${baseUrl}/available-slots?date=2024-01-01`);
        const data = await response.json();
        console.log('[Test 1] Get Slots:', response.status === 200 ? 'PASS' : 'FAIL', data.availableSlots ? `(Slots: ${data.availableSlots.length})` : '');
    } catch (e) {
        console.error('[Test 1] FAIL:', e.message);
    }

    // Test 2: Book Appointment (Success)
    try {
        const body = {
            customer_name: 'Test User',
            phone_number: '99999999',
            service_name: 'Test Service',
            date: '2024-01-05',
            time: '12:00'
        };
        const response = await fetch(`${baseUrl}/book-appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('[Test 2] Book Appointment:', response.status === 201 ? 'PASS' : 'FAIL', data.message || data.error);
    } catch (e) {
        console.error('[Test 2] FAIL:', e.message);
    }

    // Test 3: Double Booking (Fail)
    try {
        const body = {
            customer_name: 'Another User',
            phone_number: '88888888',
            service_name: 'Test Service',
            date: '2024-01-05',
            time: '12:00' // Same time as above
        };
        const response = await fetch(`${baseUrl}/book-appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('[Test 3] Prevent Double Booking:', response.status === 409 ? 'PASS' : 'FAIL', data.error);
    } catch (e) {
        console.error('[Test 3] FAIL:', e.message);
    }
};

startVerification();
