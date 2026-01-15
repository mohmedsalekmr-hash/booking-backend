// Native fetch
const url = 'https://booking-backend-3nvh.onrender.com/health';
console.log("Checking " + url);
fetch(url).then(async res => {
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);

    // Check bookings
    const res2 = await fetch('https://booking-backend-3nvh.onrender.com/bookings');
    console.log("Bookings Status:", res2.status);
    const data = await res2.json();
    console.log("Bookings Count:", data.bookings ? data.bookings.length : "Error");


    // Check available slots for a future date (ensure 9 AM is there)
    const futureDate = '2026-01-20';
    const res3 = await fetch(`https://booking-backend-3nvh.onrender.com/available-slots?date=${futureDate}`);
    console.log("Slots Status:", res3.status);
    const data3 = await res3.json();
    console.log("Available Slots:", JSON.stringify(data3.availableSlots));

}).catch(e => console.error(e));
