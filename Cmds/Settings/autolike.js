const { updateSetting } = require('../../config');
const { settings } = require('../../loadSettings');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        if (value === 'on') {
            if (settings.autolike) {
                return await m.reply('✅ Autolike is already ON.');
            }
            await updateSetting('autolike', 'true');
            settings.autolike = true;
            await m.reply('✅ Autolike has been turned ON. The bot will now like status updates.');
        } else if (value === 'off') {
            if (!settings.autolike) {
                return await m.reply('❌ Autolike is already OFF.');
            }
            await updateSetting('autolike', 'false');
            settings.autolike = false;
            await m.reply('❌ Autolike has been turned OFF.');
        } else {
            await m.reply(`📄 Current autolike setting: ${settings.autolike ? 'ON' : 'OFF'}\n\nUse _autolike on_ or _autolike off_.`);
        }
    });
};