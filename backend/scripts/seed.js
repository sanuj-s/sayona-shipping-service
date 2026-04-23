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
        const adminEmail = process.env.ADMIN_EMAIL || 's.sanuj2006@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD;
        const defaultAdminPassword = 'Mattada@75';
        const defaultStaffPassword = 'Staff@2026!Secure';
        const isProduction = process.env.NODE_ENV === 'production';

        if (isProduction && !adminPassword) {
            console.warn('⚠️ WARNING: ADMIN_PASSWORD is not explicitly set in production. Using fallback.');
        }

        const finalAdminPassword = adminPassword || defaultAdminPassword;
        const adminName = 'Sayona Admin';

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (existing.rows.length > 0) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalAdminPassword, salt);
            await pool.query(
                `UPDATE users SET password_hash = $1, name = $2, role = 'admin', is_locked = FALSE, failed_login_attempts = 0, lock_until = NULL WHERE email = $3`,
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

        if (isProduction && !staffPassword) {
            console.warn('⚠️ WARNING: STAFF_PASSWORD is not explicitly set in production. Using fallback.');
        }

        const finalStaffPassword = staffPassword || defaultStaffPassword;

        if (isProduction && (finalAdminPassword === defaultAdminPassword || finalStaffPassword === defaultStaffPassword)) {
            console.warn('⚠️ WARNING: Default seed passwords are being used in production! Change them immediately.');
        }

        const existingStaff = await pool.query('SELECT id FROM users WHERE email = $1', [staffEmail]);
        if (existingStaff.rows.length > 0) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(finalStaffPassword, salt);
            await pool.query(
                `UPDATE users SET password_hash = $1, name = $2, role = 'staff', is_locked = FALSE, failed_login_attempts = 0, lock_until = NULL WHERE email = $3`,
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

        // Optional demo data generation (disabled by default)
        if (process.env.SEED_MOCK_SHIPMENTS === 'true') {
            const requestedCount = Number.parseInt(process.env.SEED_MOCK_SHIPMENT_COUNT || '50', 10);
            const mockShipmentCount = Number.isNaN(requestedCount) || requestedCount < 1 ? 50 : requestedCount;

            console.log(`📦 Generating ${mockShipmentCount} mock shipments...`);
            for (let i = 1; i <= mockShipmentCount; i++) {
                const trackingNumber = `SAY${Math.floor(100000000 + Math.random() * 900000000)}`;
                await pool.query(
                    `INSERT INTO shipments 
                    (tracking_number, origin, destination, weight, shipping_type, status) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        trackingNumber,
                        'Location A',
                        'Location B',
                        (Math.random() * 50).toFixed(2),
                        i % 2 === 0 ? 'standard' : 'express',
                        'CREATED'
                    ]
                );
            }
            console.log(`✅ ${mockShipmentCount} mock shipments created.`);
        } else {
            console.log('ℹ️  Skipping mock shipment generation (SEED_MOCK_SHIPMENTS != true).');
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
