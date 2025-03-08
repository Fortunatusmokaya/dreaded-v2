const { getSettings, updateSetting } = require('../../config');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newEmoji = args[0];

        const settings = await getSettings();
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
            await m.reply(`📄 Current Status reaction emoji: ${currentEmoji}\n\nUse 'reaction random' to set it to random or 'reaction <emoji>' to set a specific emoji.`);
        }
    });
};