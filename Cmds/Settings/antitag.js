const { getSettings, getGroupSetting, updateGroupSetting } = require('../../config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        const settings = await getSettings(); 
        const prefix = settings.prefix;

        const currentSetting = await getGroupSetting(jid, 'antitag');
        const isEnabled = currentSetting === true;

        const Myself = await client.decodeJid(client.user.id);

        let groupMetadata = await client.groupMetadata(m.chat);
        let userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);

        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await m.reply('❌ I need admin privileges to enable Antitag.');
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            if (isEnabled === action) {
                return await m.reply(`✅ Antitag is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antitag', action);
            await m.reply(`✅ Antitag has been turned ${value.toUpperCase()} for this group.`);
        } else {
            await m.reply(`📄 Current Antitag setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\nUse _${prefix}antitag on_ or _${prefix}antitag off_ to change it.`);
        }
    });
};