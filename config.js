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

        await client.query(`
            CREATE TABLE IF NOT EXISTS banned_users (
                num TEXT PRIMARY KEY
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
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
            presence: 'online',
            autoview: 'true',
            autolike: 'true',
            autoread: 'true',
            autobio: 'false',
            anticall: 'true', 
            reactEmoji: '❤️'  
        };

        for (const [key, value] of Object.entries(defaultSettings)) {
            await client.query(`
                INSERT INTO settings (key, value) 
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING;
            `, [key, value]);
        }

        console.log('[DB] Database tables initialized successfully.');
    } catch (error) {
        console.error('[DB] Error initializing database:', error);
    } finally {
        client.release();
    }
}


const defaultGroupSettings = {
    antitag: 'true',         
    antidelete: 'true',               
    gcpresence: 'false',    
    antiforeign: 'true',   
    antidemote: 'false',      
    antipromote: 'true',
    events: 'true',
    antilink: 'on'
};

async function initializeGroupSettings(jid) {
    console.log(`[DB] Initializing settings for group: ${jid}`);
    try {
        for (const [key, value] of Object.entries(defaultGroupSettings)) {
            console.log(`[DB] Checking/Setting ${key} -> ${value} for group: ${jid}`);

            await pool.query(`
                INSERT INTO group_settings (jid, key, value)
                VALUES ($1, $2, $3)
                ON CONFLICT (jid, key) DO NOTHING;
            `, [jid, key, value]);

            console.log(`[DB] Ensured setting exists: ${jid} - ${key} -> ${value}`);
        }
    } catch (error) {
        console.error(`[DB] Error initializing group settings for ${jid}:`, error);
    }
}

async function getGroupSetting(jid) {
    console.log(`[DB] Fetching all settings for group: ${jid}`);
    try {
        const res = await pool.query(`
            SELECT key, value FROM group_settings WHERE jid = $1;
        `, [jid]);

        console.log(`[DB] Query result for ${jid}:`, JSON.stringify(res.rows));

        let settings = {};
        res.rows.forEach(row => {
            settings[row.key] = row.value === 'true' ? true : row.value === 'false' ? false : row.value;
        });

        console.log(`[DB] Retrieved settings for ${jid}:`, settings);
        return settings;
    } catch (error) {
        console.error(`[DB] Error fetching settings for group ${jid}:`, error);
        return {};
    }
}

async function updateGroupSetting(jid, key, value) {
    console.log(`[DB] Updating setting for group ${jid}: ${key} -> ${value}`);
    try {
        const valueToStore = typeof value === 'boolean' ? (value ? 'true' : 'false') : value;

        await pool.query(`
            INSERT INTO group_settings (jid, key, value)
            VALUES ($1, $2, $3)
            ON CONFLICT (jid, key) DO UPDATE
            SET value = EXCLUDED.value;
        `, [jid, key, valueToStore]);

        console.log(`[DB] Group setting updated successfully: ${jid} - ${key} -> ${valueToStore}`);
    } catch (error) {
        console.error(`[DB] Error updating setting for group ${jid}: ${key}`, error);
    }
}

async function getAllGroupSettings() {
    console.log(`[DB] Fetching settings for all groups`);
    try {
        const res = await pool.query(`
            SELECT * FROM group_settings;
        `);

        console.log(`[DB] Query result for all groups:`, JSON.stringify(res.rows));
        return res.rows;
    } catch (error) {
        console.error(`[DB] Error fetching settings for all groups:`, error);
        return [];
    }
}
async function getSettings() {
    try {
        const res = await pool.query("SELECT key, value FROM settings");
        const settings = {};

        res.rows.forEach(row => {
            settings[row.key] = row.value === 'true' ? true : row.value === 'false' ? false : row.value;
        });

    
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





async function banUser(num) {
    try {
        await pool.query(`INSERT INTO banned_users (num) VALUES ($1) ON CONFLICT (num) DO NOTHING;`, [num]);
        console.log(`[DB] User ${num} banned successfully.`);
    } catch (error) {
        console.error(`[DB] Error banning user ${num}:`, error);
    }
}

async function unbanUser(num) {
    try {
        await pool.query(`DELETE FROM banned_users WHERE num = $1;`, [num]);
        console.log(`[DB] User ${num} unbanned successfully.`);
    } catch (error) {
        console.error(`[DB] Error unbanning user ${num}:`, error);
    }
}


async function addSudoUser(num) {
    try {
        await pool.query(`INSERT INTO sudo_users (num) VALUES ($1) ON CONFLICT (num) DO NOTHING;`, [num]);
        console.log(`[DB] Sudo user ${num} added successfully.`);
    } catch (error) {
        console.error(`[DB] Error adding sudo user ${num}:`, error);
    }
}

async function removeSudoUser(num) {
    try {
        await pool.query(`DELETE FROM sudo_users WHERE num = $1;`, [num]);
        console.log(`[DB] Sudo user ${num} removed successfully.`);
    } catch (error) {
        console.error(`[DB] Error removing sudo user ${num}:`, error);
    }
}

async function getSudoUsers() {
    try {
        const res = await pool.query('SELECT num FROM sudo_users');
        return res.rows.map(row => row.num);
    } catch (error) {
        console.error('[DB] Error fetching sudo users:', error);
        return [];
    }
}

initializeDatabase().catch(console.error);

module.exports = {
    addSudoUser,
    getSudoUsers,
    removeSudoUser,
    banUser,
    unbanUser,
    getSettings,
    updateSetting,
    getGroupSetting,
    updateGroupSetting,
    initializeGroupSettings
};