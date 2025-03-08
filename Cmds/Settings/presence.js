const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        const settings = await getSettings();
        const prefix = settings.prefix;

        const validPresenceValues = ['online', 'offline', 'recording', 'typing'];

        if (validPresenceValues.includes(value)) {
            if (settings.presence === value) {
                return await m.reply(`✅ Presence was already set to: ${value}`);
            }

            await updateSetting('presence', value);
            await m.reply(`✅ Presence has been updated to: ${value}`);
        } else {
            await m.reply(`📄 Current presence setting: ${settings.presence || 'undefined'}\n\n _Use ${prefix}presence online, ${prefix}presence offline, ${prefix}presence recording, or ${prefix}presence typing._`);
        }
    });
};