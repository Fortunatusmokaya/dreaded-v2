const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');
const { getSettings, getGroupSetting, updateGroupSetting } = require('../../config');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        
        const settings = await getSettings();
        const prefix = settings.prefix;
        
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        let groupSettings = await getGroupSetting(jid, 'events');
        
        if (groupSettings === null) {
            await updateGroupSetting(jid, 'events', false);
            groupSettings = false;
        }

        if (value === 'on') {
            if (groupSettings) {
                return await m.reply(`✅ Events are already ON for this group.`);
            }
            await updateGroupSetting(jid, 'events', true);
            await m.reply(`✅ Events have been turned ON for this group. Bot will now send welcome and farewell messages!`);
        } else if (value === 'off') {
            if (!groupSettings) {
                return await m.reply(`❌ Events are already OFF for this group.`);
            }
            await updateGroupSetting(jid, 'events', false);
            await m.reply(`❌ Events have been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current events setting for this group: ${groupSettings ? 'ON' : 'OFF'}\n\n Use "${prefix}events on" or "${prefix}events off".`);
        }
    });
};