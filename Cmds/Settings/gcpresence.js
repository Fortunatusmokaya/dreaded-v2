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

        const currentSetting = await getGroupSetting(jid, 'gcpresence');
        const isEnabled = currentSetting === true;

        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            if (isEnabled === action) {
                return await m.reply(`✅ GCPresence is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'gcpresence', action);
            await m.reply(`✅ GCPresence has been turned ${value.toUpperCase()} for this group. Bot will now simulate a fake typing and recording.`);
        } else {
            await m.reply(`📄 Current Presence setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\nUse _${prefix}gcpresence on_ or _${prefix}gcpresence off_ to change it.`);
        }
    });
};