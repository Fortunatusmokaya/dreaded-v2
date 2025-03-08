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

        let groupSettings = await getGroupSetting(jid, 'antidelete');

        if (groupSettings === null) {
            await updateGroupSetting(jid, 'antidelete', false);
            groupSettings = false;
        }

        if (value === 'on') {
            if (groupSettings) {
                return await m.reply(`✅ Antidelete is already ON.`);
            }
            await updateGroupSetting(jid, 'antidelete', true);
            await m.reply(`✅ Antidelete has been turned ON for this group. Deleted messages will be forwarded to your inbox.`);
        } else if (value === 'off') {
            if (!groupSettings) {
                return await m.reply(`❌ Antidelete is already OFF.`);
            }
            await updateGroupSetting(jid, 'antidelete', false);
            await m.reply(`❌ Antidelete has been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current Antidelete setting for this group: ${groupSettings ? 'ON' : 'OFF'}\n\n_Use ${prefix}antidelete on or ${prefix}antidelete off._`);
        }
    });
};