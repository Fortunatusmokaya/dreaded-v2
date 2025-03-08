const { getSettings, getGroupSetting, updateGroupSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        const settings = await getSettings();
        const prefix = settings.prefix;

        let groupSettings = await getGroupSetting(jid);
        let isEnabled = groupSettings?.antipromote === true;

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (isEnabled === action) {
                return await m.reply(`✅ Antipromote is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antipromote', action ? 'true' : 'false');
            await m.reply(`✅ Antipromote has been turned ${value.toUpperCase()} for this group. Bot will now monitor promotions.`);
        } else {
            await m.reply(`📄 Current Antipromote setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\n _Use ${prefix}antipromote on or ${prefix}antipromote off to change it._`);
        }
    });
};