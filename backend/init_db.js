const pool = require('./config/db');

const initDB = async () => {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'employee',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createShipmentsTable = `
        CREATE TABLE IF NOT EXISTS shipments (
            id SERIAL PRIMARY KEY,
            tracking_id VARCHAR(50) UNIQUE NOT NULL,
            sender_name VARCHAR(100) NOT NULL,
            receiver_name VARCHAR(100) NOT NULL,
            origin VARCHAR(100) NOT NULL,
            destination VARCHAR(100) NOT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createTrackingTable = `
        CREATE TABLE IF NOT EXISTS tracking (
            id SERIAL PRIMARY KEY,
            tracking_id VARCHAR(50) NOT NULL,
            location VARCHAR(100) NOT NULL,
            status VARCHAR(50) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tracking_id) REFERENCES shipments(tracking_id) ON DELETE CASCADE
        );
    `;

    try {
        console.log('Initializing Database Tables...');
        await pool.query(createUsersTable);
        await pool.query(createShipmentsTable);
        await pool.query(createTrackingTable);
        console.log('Database Tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database tables:', error.message);
    } finally {
        if (require.main === module) {
            pool.end();
        }
    }
};

if (require.main === module) {
    initDB();
}

module.exports = initDB;
