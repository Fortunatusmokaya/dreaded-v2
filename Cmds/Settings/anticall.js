const { getSettings, updateSetting } = require('../../config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;

        let settings = await getSettings();
        const prefix = settings.prefix;
        const value = args[0]?.toLowerCase();

        if (value === 'reject') {
            if (settings.anticall === 'reject') {
                return await m.reply('✅ Anti-call was already set to REJECT.');
            }
            await updateSetting('anticall', 'reject');
            await m.reply('✅ Anti-call has been set to REJECT. Calls will now be politely rejected.');
        } else if (value === 'block') {
            if (settings.anticall === 'block') {
                return await m.reply('✅ Anti-call was already set to BLOCK.');
            }
            await updateSetting('anticall', 'block');
            await m.reply('✅ Anti-call has been set to BLOCK. Calls will now be REJECTED and the caller blocked and banned.');
        } else if (value === 'off') {
            if (settings.anticall === 'off') {
                return await m.reply('✅ Anti-call was already OFF.');
            }
            await updateSetting('anticall', 'off');
            await m.reply('❌ Anti-call has been turned OFF.');
        } else {
            await m.reply(
                `📄 Current anti-call setting: ${settings.anticall?.toUpperCase() || 'OFF'}\n\n` +
                `_Use "${prefix}anticall reject", "${prefix}anticall block", or "${prefix}anticall off"._`
            );
        }
    });
};