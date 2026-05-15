const express = require('express');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/', webhookRoutes);

module.exports = app;
