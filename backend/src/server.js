require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

const appointmentRoutes = require('./routes/appointmentRoutes');

app.use(cors());
app.use(express.json());

app.use('/', appointmentRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.send('Appointment Booking API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
