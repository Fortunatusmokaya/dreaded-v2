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

        let groupSettings = await getGroupSettings(jid);
        let settings = await getSettings();

        if (value === 'on') {
            if (groupSettings.gcpresence) {
                return await m.reply('✅ Presence is already ON for this group.');
            }
            await updateGroupSetting(jid, 'gcpresence', 'true');
            await m.reply('✅ Presence has been turned ON for this group. Bot will now simulate typing or recording.');
        } else if (value === 'off') {
            if (!groupSettings.gcpresence) {
                return await m.reply('❌ Presence is already OFF for this group.');
            }
            await updateGroupSetting(jid, 'gcpresence', 'false');
            await m.reply('❌ Presence has been turned OFF for this group.');
        } else {
            await m.reply(`📄 Current GCPresence setting for this group: ${groupSettings.gcpresence ? 'ON' : 'OFF'}\n\nUse _${settings.prefix}gcpresence on_ or _${settings.prefix}gcpresence off_._`);
        }
    });
};