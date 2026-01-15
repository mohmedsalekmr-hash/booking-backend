const url = 'https://booking-backend-3nvh.onrender.com/health';
console.log("Checking Version at " + url);
fetch(url)
    .then(async res => {
        const text = await res.text();
        console.log("SERVER VERSION: " + text);
    })
    .catch(e => console.error("ERROR:", e.message));
