// =========================================================
// Database Connection Configuration (MySQL using mysql2)
// =========================================================
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gym_management_system',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use the promise-based wrapper for async/await support
const db = pool.promise();

// Quick connectivity check on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'gym_management_system');
    connection.release();
});

module.exports = db;
