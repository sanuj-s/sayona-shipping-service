const pool = require('./config/db');

const initDB = async () => {
    const createAdminsTable = `
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            company VARCHAR(100),
            role VARCHAR(20) DEFAULT 'client',
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createShipmentsTable = `
        CREATE TABLE IF NOT EXISTS shipments (
            id SERIAL PRIMARY KEY,
            tracking_id VARCHAR(50) UNIQUE NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            sender_name VARCHAR(100) NOT NULL,
            receiver_name VARCHAR(100) NOT NULL,
            origin VARCHAR(100) NOT NULL,
            destination VARCHAR(100) NOT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            industry_type VARCHAR(50) DEFAULT 'Unspecified',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createTrackingTable = `
        CREATE TABLE IF NOT EXISTS tracking (
            id SERIAL PRIMARY KEY,
            tracking_id VARCHAR(50) NOT NULL,
            location VARCHAR(100) NOT NULL,
            status VARCHAR(50) NOT NULL,
            description TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tracking_id) REFERENCES shipments(tracking_id) ON DELETE CASCADE
        );
    `;

    const createContactMessagesTable = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(255) DEFAULT 'General Inquiry',
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createQuoteRequestsTable = `
        CREATE TABLE IF NOT EXISTS quote_requests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            company VARCHAR(150),
            origin VARCHAR(100) NOT NULL,
            destination VARCHAR(100) NOT NULL,
            cargo_type VARCHAR(100),
            weight VARCHAR(50),
            message TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Indexes for performance
    const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_tracking_tracking_id ON tracking(tracking_id);
        CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
        CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
        CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
        CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
    `;

    // Auto-update updated_at on shipments
    const createUpdateTrigger = `
        CREATE OR REPLACE FUNCTION update_shipments_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_trigger WHERE tgname = 'trg_shipments_updated_at'
            ) THEN
                CREATE TRIGGER trg_shipments_updated_at
                BEFORE UPDATE ON shipments
                FOR EACH ROW
                EXECUTE FUNCTION update_shipments_updated_at();
            END IF;
        END $$;
    `;

    try {
        console.log('Initializing Database Tables...');
        await pool.query(createAdminsTable);
        await pool.query(createUsersTable);
        await pool.query(createShipmentsTable);
        await pool.query(createTrackingTable);
        await pool.query(createContactMessagesTable);
        await pool.query(createQuoteRequestsTable);
        await pool.query(createIndexes);
        await pool.query(createUpdateTrigger);
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
