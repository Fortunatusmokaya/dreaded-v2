const { getSettings } = require('./config');

async function loadSettings() {
    const settings = await getSettings();
    if (!settings) return null;

    return {
        autoread: settings.autoread,
        autolike: settings.autolike,
        autoview: settings.autoview,
        presence: settings.presence,
        reactEmoji: settings.reactEmoji
    };
}

module.exports = { loadSettings };