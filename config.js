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


const defaultGroupSettings = {
    antitag: 'true',         
    antidelete: 'true',               
    gcpresence: 'false',    
    antiforeign: 'true',   
    antidemote: 'true',      
    antipromote: 'true'      
};

async function initializeGroupSettings(jid) {
    try {
        for (const [key, value] of Object.entries(defaultGroupSettings)) {
            await pool.query(`
                INSERT INTO group_settings (jid, key, value)
                VALUES ($1, $2, $3)
                ON CONFLICT (jid, key) DO NOTHING;
            `, [jid, key, value]);
        }

        console.log(`[DB] Default group settings initialized for group: ${jid}`);
    } catch (error) {
        console.error('[DB] Error initializing group settings:', error);
    }
}

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
            autobio: 'false'
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


async function removeSudoUser(num) {
    const client = await pool.connect();
    try {
        
        await client.query(`
            DELETE FROM sudo_users WHERE num = $1;
        `, [num]);

        console.log(`[DB] Sudo user ${num} removed successfully.`);
    } catch (error) {
        console.error(`[DB] Error removing sudo user ${num}:`, error);
    } finally {
        client.release();
    }
}
async function addSudoUser(num) {
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO sudo_users (num)
            VALUES ($1)
            ON CONFLICT (num) DO NOTHING;
        `, [num]);
        console.log(`[DB] Sudo user ${num} added successfully.`);
    } catch (error) {
        console.error(`[DB] Error adding sudo user ${num}:`, error);
    } finally {
        client.release();
    }
}

async function getSudoUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT num FROM sudo_users');
        return res.rows.map(row => row.num);
    } catch (error) {
        console.error('[DB] Error fetching sudo users:', error);
        return [];
    } finally {
        client.release();
    }
}

async function isSudoUser(num) {
    const sudoUsers = await getSudoUsers();
    return sudoUsers.includes(num);
}

async function banUser(num) {
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO banned_users (num)
            VALUES ($1)
            ON CONFLICT (num) DO NOTHING;
        `, [num]);
        console.log(`[DB] User ${num} banned successfully.`);
    } catch (error) {
        console.error(`[DB] Error banning user ${num}:`, error);
    } finally {
        client.release();
    }
}

async function unbanUser(num) {
    const client = await pool.connect();
    try {
        await client.query(`
            DELETE FROM banned_users WHERE num = $1;
        `, [num]);
        console.log(`[DB] User ${num} unbanned successfully.`);
    } catch (error) {
        console.error(`[DB] Error unbanning user ${num}:`, error);
    } finally {
        client.release();
    }
}

async function getBannedUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT num FROM banned_users');
        return res.rows.map(row => row.num);
    } catch (error) {
        console.error('[DB] Error fetching banned users:', error);
        return [];
    } finally {
        client.release();
    }
}

async function addUser(num) {
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO users (num)
            VALUES ($1)
            ON CONFLICT (num) DO NOTHING;
        `, [num]);
        console.log(`[DB] User ${num} added successfully.`);
    } catch (error) {
        console.error(`[DB] Error adding user ${num}:`, error);
    } finally {
        client.release();
    }
}

async function getSettings() {
   
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

        console.log(`[DB] Query result: ${JSON.stringify(res.rows)}`);
        
        if (res.rows.length > 0) {
            const value = res.rows[0].value;
            
            if (value === 'true') return true;
            if (value === 'false') return false;
            return value;  
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
      
        const valueToStore = typeof value === 'boolean' ? (value ? 'true' : 'false') : value;

        await pool.query(`
            INSERT INTO group_settings (jid, key, value)
            VALUES ($1, $2, $3)
            ON CONFLICT (jid, key) DO UPDATE
            SET value = EXCLUDED.value;
        `, [jid, key, valueToStore]);

        console.log(`[DB] Group setting updated successfully: ${jid} - ${key} -> ${valueToStore}`);
    } catch (error) {
        console.error(`[DB] Error updating group setting: ${jid} - ${key}`, error);
    }
}

initializeDatabase().catch(console.error);

module.exports = {
    addSudoUser,
    getSudoUsers,
    isSudoUser,
removeSudoUser,
    banUser,
    unbanUser,
    getBannedUsers,
    addUser,
    getSettings,
    updateSetting,
    getGroupSetting,
    updateGroupSetting
};