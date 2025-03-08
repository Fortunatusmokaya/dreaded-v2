const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        const settings = await getSettings();

        if (value === 'on') {
            if (settings.autoread) {
                return await m.reply('✅ Autoread is already ON.');
            }
            await updateSetting('autoread', 'true');
            await m.reply('✅ Autoread has been turned ON. The bot will now automatically read messages.');
        } else if (value === 'off') {
            if (!settings.autoread) {
                return await m.reply('❌ Autoread is already OFF.');
            }
            await updateSetting('autoread', 'false');
            await m.reply('❌ Autoread has been turned OFF.');
        } else {
            await m.reply(`📄 Current autoread setting: ${settings.autoread ? 'ON' : 'OFF'}\n\nUse _${settings.prefix}autoread on_ or _${settings.prefix}autoread off_.`);
        }
    });
};