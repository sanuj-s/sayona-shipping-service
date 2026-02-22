// ─────────────────────────────────────────────
// Seed Script — Create initial admin user
// Usage: node scripts/seed.js
// ─────────────────────────────────────────────
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function seed() {
    try {
        console.log('═══════════════════════════════════════');
        console.log('  Sayona Shipping — Database Seed');
        console.log('═══════════════════════════════════════');

        // Admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@sayona.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026!Secure';
        const adminName = 'Sayona Admin';

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (existing.rows.length > 0) {
            console.log(`Admin user (${adminEmail}) already exists, skipping.`);
        } else {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(adminPassword, salt);

            await pool.query(
                `INSERT INTO users (name, email, password_hash, role, is_verified) 
                 VALUES ($1, $2, $3, 'admin', TRUE)`,
                [adminName, adminEmail, passwordHash]
            );
            console.log(`✅ Admin user created: ${adminEmail}`);
        }

        // Staff user
        const staffEmail = process.env.STAFF_EMAIL || 'staff@sayona.com';
        const staffPassword = process.env.STAFF_PASSWORD || 'Staff@2026!Secure';

        const existingStaff = await pool.query('SELECT id FROM users WHERE email = $1', [staffEmail]);
        if (existingStaff.rows.length > 0) {
            console.log(`Staff user (${staffEmail}) already exists, skipping.`);
        } else {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(staffPassword, salt);

            await pool.query(
                `INSERT INTO users (name, email, password_hash, role, is_verified) 
                 VALUES ($1, $2, $3, 'staff', TRUE)`,
                ['Sayona Staff', staffEmail, passwordHash]
            );
            console.log(`✅ Staff user created: ${staffEmail}`);
        }

        console.log('\nSeed completed! ✅');
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
