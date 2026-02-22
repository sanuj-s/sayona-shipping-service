// ─────────────────────────────────────────────
// Migration Runner — Executes SQL migration files
// Usage: node scripts/migrate.js
// ─────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const migrationsDir = path.resolve(__dirname, '..', 'migrations');

async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log('═══════════════════════════════════════');
        console.log('  Sayona Shipping — Database Migration');
        console.log('═══════════════════════════════════════');
        console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
        console.log();

        // Get migration files sorted by name
        const files = fs.readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('No migration files found.');
            return;
        }

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            console.log(`▶ Running: ${file}`);
            const start = Date.now();

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('COMMIT');
                const duration = Date.now() - start;
                console.log(`  ✅ Completed in ${duration}ms`);
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(`  ❌ Failed: ${error.message}`);
                throw error;
            }
        }

        console.log();
        console.log('All migrations completed successfully! ✅');
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
