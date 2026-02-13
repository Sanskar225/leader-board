const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Import configurations
const connectDB = require('./config/database');
const CronService = require('./services/CronService');
const WebSocketService = require('./services/WebSocketService');

// ==========================
// Middleware
// ==========================
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// Database Connection
// ==========================
connectDB();

// ==========================
// Routes
// ==========================
const routes = require('./routes');
app.use('/api', routes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'CodeRanker API is running!',
        version: '1.0.0',
        websocket: `ws://localhost:${PORT}`,
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            leaderboard: '/api/leaderboard'
        }
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        websocket: 'active'
    });
});

// ==========================
// Initialize WebSocket
// ==========================
const wsService = new WebSocketService(server);
global.wsService = wsService;

// ==========================
// Start Cron Jobs
// ==========================
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
    CronService.start();
}

// ==========================
// Error Handling Middleware
// ==========================
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        error: 'Something went wrong',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==========================
// 404 Fallback (IMPORTANT FIX)
// ==========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// ==========================
// Start Server
// ==========================
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ==========================
// Graceful Shutdown
// ==========================
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');

    CronService.stop();

    server.close(() => {
        console.log('HTTP server closed');

        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = { app, server };
