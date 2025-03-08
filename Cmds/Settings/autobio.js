const { getSettings, updateSetting } = require('../../Database/config');

const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        const settings = await getSettings();
        const prefix = settings.prefix;

        const isEnabled = settings.autobio === true;

        if (value === 'on') {
            if (isEnabled) {
                return await m.reply('✅ Autobio is already ON.');
            }
            await updateSetting('autobio', 'true');
            await m.reply('✅ Autobio has been turned ON. The bot will auto-update its about section every 10 seconds.');
        } else if (value === 'off') {
            if (!isEnabled) {
                return await m.reply('✅ Autobio is already OFF.');
            }
            await updateSetting('autobio', 'false');
            await m.reply('❌ Autobio has been turned OFF.');
        } else {
            await m.reply(`📄 Current autobio setting: ${isEnabled ? 'ON' : 'OFF'}\n\nUse _${prefix}autobio on_ or _${prefix}autobio off_ to change it.`);
        }
    });
};