const { Pool } = require('pg');

console.log('[DB] Initializing database connection...');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function initializeDatabase() {
    const client = await pool.connect();
    console.log('[DB] Checking and creating settings tables...');
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id SERIAL PRIMARY KEY,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS group_settings (
                jid TEXT NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                PRIMARY KEY (jid, key)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                jid TEXT PRIMARY KEY,
                banned BOOLEAN DEFAULT FALSE,
                sudo BOOLEAN DEFAULT FALSE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('[DB] Default tables initialized successfully.');
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

async function getGroupSetting(jid, key) {
    console.log(`[DB] Fetching group setting for ${jid}: ${key}`);
    try {
        const res = await pool.query(`
            SELECT value FROM group_settings WHERE jid = $1 AND key = $2;
        `, [jid, key]);
        return res.rows.length > 0 ? res.rows[0].value : null;
    } catch (error) {
        console.error(`[DB] Error fetching group setting for ${jid}: ${key}`, error);
        return null;
    }
}

async function updateGroupSetting(jid, key, value) {
    console.log(`[DB] Updating group setting: ${jid} - ${key} -> ${value}`);
    try {
        await pool.query(`
            INSERT INTO group_settings (jid, key, value) 
            VALUES ($1, $2, $3)
            ON CONFLICT (jid, key) DO UPDATE 
            SET value = EXCLUDED.value;
        `, [jid, key, value]);
        console.log(`[DB] Group setting updated successfully: ${jid} - ${key} -> ${value}`);
    } catch (error) {
        console.error(`[DB] Error updating group setting: ${jid} - ${key}`, error);
    }
}

// **User Management Functions**
async function addUser(jid) {
    console.log(`[DB] Adding new user: ${jid}`);
    try {
        await pool.query(`
            INSERT INTO users (jid) VALUES ($1)
            ON CONFLICT (jid) DO NOTHING;
        `, [jid]);
        console.log(`[DB] User added: ${jid}`);
    } catch (error) {
        console.error(`[DB] Error adding user: ${jid}`, error);
    }
}

async function banUser(jid, status = true) {
    console.log(`[DB] ${status ? 'Banning' : 'Unbanning'} user: ${jid}`);
    try {
        await pool.query(`
            UPDATE users SET banned = $1 WHERE jid = $2;
        `, [status, jid]);
        console.log(`[DB] User ${status ? 'banned' : 'unbanned'}: ${jid}`);
    } catch (error) {
        console.error(`[DB] Error banning user: ${jid}`, error);
    }
}

async function isUserBanned(jid) {
    console.log(`[DB] Checking if user is banned: ${jid}`);
    try {
        const res = await pool.query(`
            SELECT banned FROM users WHERE jid = $1;
        `, [jid]);
        return res.rows.length > 0 ? res.rows[0].banned : false;
    } catch (error) {
        console.error(`[DB] Error checking ban status for user: ${jid}`, error);
        return false;
    }
}

async function setSudoUser(jid, status = true) {
    console.log(`[DB] ${status ? 'Granting' : 'Revoking'} sudo access for: ${jid}`);
    try {
        await pool.query(`
            UPDATE users SET sudo = $1 WHERE jid = $2;
        `, [status, jid]);
        console.log(`[DB] Sudo access ${status ? 'granted' : 'revoked'} for: ${jid}`);
    } catch (error) {
        console.error(`[DB] Error setting sudo user: ${jid}`, error);
    }
}

async function isSudoUser(jid) {
    console.log(`[DB] Checking if user is sudo: ${jid}`);
    try {
        const res = await pool.query(`
            SELECT sudo FROM users WHERE jid = $1;
        `, [jid]);
        return res.rows.length > 0 ? res.rows[0].sudo : false;
    } catch (error) {
        console.error(`[DB] Error checking sudo status for user: ${jid}`, error);
        return false;
    }
}

async function getTotalUsers() {
    console.log('[DB] Fetching total user count...');
    try {
        const res = await pool.query('SELECT COUNT(*) FROM users;');
        return res.rows[0].count;
    } catch (error) {
        console.error('[DB] Error fetching total users:', error);
        return 0;
    }
}

module.exports = { 
    getSettings, updateSetting, getGroupSetting, updateGroupSetting,
    addUser, banUser, isUserBanned, setSudoUser, isSudoUser, getTotalUsers
};

initializeDatabase().catch(console.error);