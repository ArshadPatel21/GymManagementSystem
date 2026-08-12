// =========================================================
// Gym Management System - Main Server File
// =========================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// Middleware
// ---------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------------------------------------------------------
// API Routes
// ---------------------------------------------------------
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/payments', require('./routes/payments'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Gym Management System API is running' });
});

// Fallback: serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---------------------------------------------------------
// 404 handler
// ---------------------------------------------------------
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ---------------------------------------------------------
// Global error handler
// ---------------------------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

// ---------------------------------------------------------
// Start Server
// ---------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Gym Management System server running at http://localhost:${PORT}`);
});
