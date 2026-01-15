const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'appointments.db');
const db = new sqlite3.Database(dbPath);

const sampleAppointments = [
    {
        customer_name: 'John Doe',
        phone_number: '12345678',
        service_name: 'Haircut',
        date: '2024-01-01',
        time: '10:00'
    },
    {
        customer_name: 'Jane Smith',
        phone_number: '87654321',
        service_name: 'Coloring',
        date: '2024-01-01',
        time: '11:00'
    },
    {
        customer_name: 'Alice Johnson',
        phone_number: '11223344',
        service_name: 'Haircut & Beard',
        date: '2024-01-02',
        time: '14:00'
    }
];

db.serialize(() => {
    console.log('Inserting sample data...');
    const stmt = db.prepare('INSERT INTO appointments (customer_name, phone_number, service_name, date, time) VALUES (?, ?, ?, ?, ?)');

    sampleAppointments.forEach(appt => {
        stmt.run([appt.customer_name, appt.phone_number, appt.service_name, appt.date, appt.time], (err) => {
            if (err) {
                console.error(`Error inserting ${appt.customer_name}:`, err.message);
            } else {
                console.log(`Inserted booking for ${appt.customer_name} at ${appt.time}`);
            }
        });
    });

    stmt.finalize(() => {
        console.log('Sample data insertion complete.');
        db.close();
    });
});
