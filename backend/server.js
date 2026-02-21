const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());

const trackingRoutes = require('./routes/trackingRoutes');

app.use('/api/tracking', trackingRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

startServer();
