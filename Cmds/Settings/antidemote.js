const { getSettings, getGroupSetting, updateGroupSetting } = require('../../config');
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

        const currentSetting = await getGroupSetting(jid, 'antidemote');
        const isEnabled = currentSetting === true;

        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            if (isEnabled === action) {
                return await m.reply(`✅ Antidemote is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antidemote', action);
            await m.reply(`✅ Antidemote has been turned ${value.toUpperCase()} for this group. Bot will monitor demotions.`);
        } else {
            await m.reply(`📄 Current Antidemote setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\n _Use ${prefix}antidemote on or ${prefix}antidemote off to change it._`);
        }
    });
};