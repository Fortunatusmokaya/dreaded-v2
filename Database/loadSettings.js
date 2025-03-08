const { getSettings } = require('./config');

async function loadSettings() {
    const settings = await getSettings();
    if (!settings) return null;

    return {
        prefix: settings.prefix,
        packname: settings.packname,
        mode: settings.mode,
        presence: settings.presence,
        autoview: settings.autoview,
        autolike: settings.autolike,
        autoread: settings.autoread,
        autobio: settings.autobio,
        anticall: settings.anticall,
        reactEmoji: settings.reactEmoji,
        antitag: settings.antitag,
        antidelete: settings.antidelete,
        gcpresence: settings.gcpresence,
        antiforeign: settings.antiforeign,
        antidemote: settings.antidemote,
        antipromote: settings.antipromote,
        events: settings.events,
        antilink: settings.antilink
    };
}

module.exports = { loadSettings };