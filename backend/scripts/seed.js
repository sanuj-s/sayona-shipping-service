// ─────────────────────────────────────────────
// Seed Script — Create initial admin user
// Usage: node scripts/seed.js
// ─────────────────────────────────────────────
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const { pool } = require('../src/config/database');

async function seed() {
    try {
        console.log('═══════════════════════════════════════');
        console.log('  Sayona Shipping — Database Seed');
        console.log('═══════════════════════════════════════');

        // Admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@sayona.com';
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (process.env.NODE_ENV === 'production' && !adminPassword) {
            console.error('❌ CRITICAL: ADMIN_PASSWORD must be explicitly set in production.');
            process.exit(1);
        }

        const finalAdminPassword = adminPassword || 'Admin@2026!Secure';
        const adminName = 'Sayona Admin';

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (existing.rows.length > 0) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalAdminPassword, salt);
            await pool.query(
                `UPDATE users SET password_hash = $1, name = $2 WHERE email = $3`,
                [passwordHash, adminName, adminEmail]
            );
            console.log(`✅ Admin user (${adminEmail}) updated with latest credentials.`);
        } else {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalAdminPassword, salt);

            await pool.query(
                `INSERT INTO users (name, email, password_hash, role, is_verified) 
                 VALUES ($1, $2, $3, 'admin', TRUE)`,
                [adminName, adminEmail, passwordHash]
            );
            console.log(`✅ Admin user created: ${adminEmail}`);
        }

        // Staff user
        const staffEmail = process.env.STAFF_EMAIL || 'staff@sayona.com';
        const staffPassword = process.env.STAFF_PASSWORD;

        if (process.env.NODE_ENV === 'production' && !staffPassword) {
            console.warn('⚠️ WARNING: STAFF_PASSWORD not explicitly set in production. Using default.');
        }

        const finalStaffPassword = staffPassword || 'Staff@2026!Secure';

        const existingStaff = await pool.query('SELECT id FROM users WHERE email = $1', [staffEmail]);
        if (existingStaff.rows.length > 0) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalStaffPassword, salt);
            await pool.query(
                `UPDATE users SET password_hash = $1, name = $2 WHERE email = $3`,
                [passwordHash, 'Sayona Staff', staffEmail]
            );
            console.log(`✅ Staff user (${staffEmail}) updated with latest credentials.`);
        } else {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalStaffPassword, salt);

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
