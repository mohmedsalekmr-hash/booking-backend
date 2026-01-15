require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

const appointmentRoutes = require('./routes/appointmentRoutes');

app.use(cors());
app.use(express.json());

// Debugging Routes
console.log("Loading appointmentRoutes:", appointmentRoutes);

app.use('/', appointmentRoutes);

// Helper to list all routes
const getRoutes = () => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) { // routes registered directly on the app
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') { // router middleware 
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) routes.push(handler.route.path);
            });
        }
    });
    return routes;
};

// Route Inspector
app.get('/debug-routes', (req, res) => {
    res.json({
        message: "Route Debugger",
        routes: getRoutes(),
        env: process.env.NODE_ENV
    });
});

// Basic health check route
app.get('/health', (req, res) => {
    res.send('Appointment Booking API is running (v2.0 - Debug Mode)');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Registered Routes:");
    console.log(" - /health");
    console.log(" - /bookings");
    console.log(" - /available-slots");
});
