const { Pool } = require('pg');

console.log('[DB] Initializing database connection...');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function initializeDatabase() {
    const client = await pool.connect();
    console.log('[DB] Checking and creating settings table...');
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id SERIAL PRIMARY KEY,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
            );
        `);

        const defaultSettings = {
            prefix: '.',
            mycode: '254',
            author: 'fortunatus',
            packname: 'dreaded md2 🤖',
            botname: 'DREADED',
            mode: 'public',
            gcpresence: 'false',
            antionce: 'true',
            presence: 'online',
            antitag: 'true',
            antidelete: 'true',
            autoview: 'true',
            autolike: 'true',
            autoread: 'true',
            autobio: 'false'
        };

        for (const [key, value] of Object.entries(defaultSettings)) {
            await client.query(`
                INSERT INTO settings (key, value) 
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING;
            `, [key, value]);
        }

        console.log('[DB] Default settings initialized successfully.');
    } catch (error) {
        console.error('[DB] Error initializing database:', error);
    } finally {
        client.release();
    }
}

async function getSettings() {
    console.log('[DB] Fetching settings...');
    try {
        const res = await pool.query("SELECT key, value FROM settings");
        const settings = {};
        res.rows.forEach(row => {
            if (row.value === 'true') {
                settings[row.key] = true;
            } else if (row.value === 'false') {
                settings[row.key] = false;
            } else {
                settings[row.key] = row.value;
            }
        });
        console.log('[DB] Settings fetched successfully.');
        return settings;
    } catch (error) {
        console.error('[DB] Error fetching settings:', error);
        return {};
    }
}

async function updateSetting(key, value) {
    console.log(`[DB] Updating setting: ${key} -> ${value}`);
    try {
        await pool.query(`
            INSERT INTO settings (key, value) 
            VALUES ($1, $2)
            ON CONFLICT (key) DO UPDATE 
            SET value = EXCLUDED.value;
        `, [key, value]);
        console.log(`[DB] Setting updated successfully: ${key} -> ${value}`);
    } catch (error) {
        console.error(`[DB] Error updating setting: ${key}`, error);
    }
}

module.exports = { getSettings, updateSetting };

initializeDatabase().catch(console.error);