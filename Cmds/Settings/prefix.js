const { settings } = require('../../loadSettings'); 
const { updateSetting } = require('../../config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newPrefix = args[0];

        if (newPrefix === 'null') {
            if (!settings.prefix) {
                return await m.reply(`✅ The bot was already prefixless.`);
            }
            await updateSetting('prefix', '');
            await m.reply(`✅ The bot is now prefixless.`);
        } else if (newPrefix) {
            if (settings.prefix === newPrefix) {
                return await m.reply(`✅ The prefix was already set to: ${newPrefix}`);
            }
            await updateSetting('prefix', newPrefix);
            await m.reply(`✅ Prefix has been updated to: ${newPrefix}`);
        } else {
            await m.reply(`📄 Current prefix: ${settings.prefix || 'No prefix set.'}\n\nUse _prefix null_ to remove the prefix or _prefix <any symbol>_ to set a specific prefix.`);
        }
    });
};