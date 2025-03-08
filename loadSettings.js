const { getSettings } = require('./config');

let settings = {};

async function loadSettings() {
    settings = await getSettings();
    console.log('[Settings] Loaded:', settings);
}


loadSettings();

module.exports = { settings };