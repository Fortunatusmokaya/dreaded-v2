const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        const settings = await getSettings();

        if (value === 'on') {
            if (settings.autoview) {
                return await m.reply('✅ Autoview is already ON.');
            }
            await updateSetting('autoview', 'true');
            await m.reply('✅ Autoview has been turned ON. The bot will now automatically view status updates.');
        } else if (value === 'off') {
            if (!settings.autoview) {
                return await m.reply('❌ Autoview is already OFF.');
            }
            await updateSetting('autoview', 'false');
            await m.reply('❌ Autoview has been turned OFF.');
        } else {
            await m.reply(`📄 Current autoview setting: ${settings.autoview ? 'ON' : 'OFF'}\n\nUse _${settings.prefix}autoview on_ or _${settings.prefix}autoview off_.`);
        }
    });
};