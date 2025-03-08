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

        let currentSetting = await getGroupSetting(jid, 'antidemote');
        
      
        const isEnabled = Boolean(currentSetting);
        const isDisabled = !isEnabled;

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (action === isEnabled) {
                return await m.reply(`✅ Antidemote is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antidemote', action);

          
            const newSetting = await getGroupSetting(jid, 'antidemote');

            if (Boolean(newSetting) === action) {
                await m.reply(`✅ Antidemote has been turned ${value.toUpperCase()} for this group. Bot will monitor demotions.`);
            } else {
                await m.reply(`⚠️ Failed to update Antidemote. Please try again.`);
            }
        } else {
            await m.reply(
                `📄 Current Antidemote setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\n` +
                `_Use ${prefix}antidemote on or ${prefix}antidemote off to change it._`
            );
        }
    });
};