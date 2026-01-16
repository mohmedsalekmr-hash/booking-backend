const express = require('express');
const settingsRoutes = require('./src/routes/settingsRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();
app.use('/', appointmentRoutes);
app.use('/', settingsRoutes);

const getRoutes = () => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    const method = Object.keys(handler.route.methods)[0].toUpperCase();
                    routes.push(`${method} ${handler.route.path}`);
                }
            });
        }
    });
    return routes;
};

console.log("Registered Routes in Isolation:");
console.log(getRoutes());
