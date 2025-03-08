const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newEmoji = args[0];

        const settings = await getSettings();
        const prefix = settings.prefix;
        const currentEmoji = settings.reactEmoji || 'No react emoji set.';

        if (newEmoji) {
            if (newEmoji === 'random') {
                if (currentEmoji === 'random') {
                    return await m.reply('✅ The bot is already set to react with random emojis on status!');
                }
                await updateSetting('reactEmoji', 'random');
                await m.reply('✅ Status react emoji has been updated to random. The bot will react with a random emoji.');
            } else {
                if (currentEmoji === newEmoji) {
                    return await m.reply(`✅ Status react emoji was already set to: ${newEmoji}`);
                }
                await updateSetting('reactEmoji', newEmoji);
                await m.reply(`✅ Status react emoji has been updated to: ${newEmoji}`);
            }
        } else {
            await m.reply(`📄 Current reaction emoji: ${currentEmoji}\n\nUse _${prefix}reaction random_ to set it to random or _${prefix}reaction <emoji>_ to set a specific emoji.`);
        }
    });
};