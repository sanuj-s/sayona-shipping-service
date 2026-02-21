const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        const email = 'admin@sayona.com';
        const password = 'admin123';
        const name = 'Sayona Admin';

        // Check if admin already exists
        const existing = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            console.log('Admin already exists, skipping seed.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)',
            [name, email, passwordHash]
        );

        console.log(`Admin seeded: ${email} / ${password}`);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    } finally {
        if (require.main === module) {
            pool.end();
        }
    }
};

if (require.main === module) {
    seedAdmin();
}

module.exports = seedAdmin;
