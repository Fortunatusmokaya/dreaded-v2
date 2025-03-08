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
            CREATE TABLE IF NOT EXISTS sudo_users (
                num TEXT PRIMARY KEY
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
            settings[row.key] = row.value === 'true' ? true : row.value === 'false' ? false : row.value;
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
        if (res.rows.length > 0) {
            return res.rows[0].value === 'true' ? true : res.rows[0].value === 'false' ? false : res.rows[0].value;
        }
        return null;
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


async function getSudoUsers() {
    console.log('[DB] Fetching sudo users...');
    try {
        const res = await pool.query("SELECT num FROM sudo_users");
        const sudoUsers = res.rows.map(row => row.num);
        console.log('[DB] Sudo users fetched successfully.');
        return sudoUsers;
    } catch (error) {
        console.error('[DB] Error fetching sudo users:', error);
        return [];
    }
}


async function addSudoUser(num) {
    console.log(`[DB] Adding sudo user: ${num}`);
    try {
        await pool.query(`
            INSERT INTO sudo_users (num) 
            VALUES ($1) 
            ON CONFLICT (num) DO NOTHING;
        `, [num]);
        console.log(`[DB] Sudo user added successfully: ${num}`);
    } catch (error) {
        console.error(`[DB] Error adding sudo user: ${num}`, error);
    }
}


async function removeSudoUser(num) {
    console.log(`[DB] Removing sudo user: ${num}`);
    try {
        await pool.query(`
            DELETE FROM sudo_users WHERE num = $1;
        `, [num]);
        console.log(`[DB] Sudo user removed successfully: ${num}`);
    } catch (error) {
        console.error(`[DB] Error removing sudo user: ${num}`, error);
    }
}

module.exports = {
    getSettings,
    updateSetting,
    getGroupSetting,
    updateGroupSetting,
    getSudoUsers,
    addSudoUser,
    removeSudoUser
};

initializeDatabase().catch(console.error);