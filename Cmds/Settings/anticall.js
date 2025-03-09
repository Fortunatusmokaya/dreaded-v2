const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        let settings = await getSettings();
        const prefix = settings.prefix;
        let isEnabled = settings.anticall === true;

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (isEnabled === action) {
                return await m.reply(`✅ Anti-call is already ${value.toUpperCase()}.`);
            }

            await updateSetting('anticall', action ? true : false);
            await m.reply(`✅ Anti-call has been turned ${value.toUpperCase()}.`);
        } else {
            await m.reply(
                `📄 Current Anti-call setting: ${isEnabled ? 'ON' : 'OFF'}\n\n` +
                `_Use "${prefix}anticall on" or "${prefix}anticall off" to change it._`
            );
        }
    });
};