// ─────────────────────────────────────────────
// Migration Runner — Executes SQL migration files
// Tracks applied migrations to prevent re-runs.
// Usage: node scripts/migrate.js
// ─────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { pool } = require('../src/config/database');

const migrationsDir = path.resolve(__dirname, '..', 'migrations');

async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log('═══════════════════════════════════════');
        console.log('  Sayona Shipping — Database Migration');
        console.log('═══════════════════════════════════════');
        console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
        console.log();

        // Ensure migration tracking table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Get already-applied migrations
        const applied = await client.query('SELECT version FROM schema_migrations ORDER BY version');
        const appliedSet = new Set(applied.rows.map(r => r.version));

        // Get migration files sorted by name
        const files = fs.readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('No migration files found.');
            return;
        }

        let appliedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            // Skip the tracking table bootstrap migration itself
            if (file === '000_migration_tracking.sql') {
                continue;
            }

            if (appliedSet.has(file)) {
                console.log(`  ⏭  Skipping: ${file} (already applied)`);
                skippedCount++;
                continue;
            }

            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            console.log(`▶ Running: ${file}`);
            const start = Date.now();

            await client.query('BEGIN');
            try {
                await client.query(sql);
                // Record migration as applied
                await client.query(
                    'INSERT INTO schema_migrations (version) VALUES ($1)',
                    [file]
                );
                await client.query('COMMIT');
                const duration = Date.now() - start;
                console.log(`  ✅ Completed in ${duration}ms`);
                appliedCount++;
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(`  ❌ Failed: ${error.message}`);
                throw error;
            }
        }

        console.log();
        console.log(`Migration complete: ${appliedCount} applied, ${skippedCount} skipped ✅`);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
