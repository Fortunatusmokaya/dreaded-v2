const { getSettings, getGroupSetting, updateGroupSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, mycode } = context;
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        const settings = await getSettings();
        const prefix = settings.prefix;

        let groupSettings = await getGroupSetting(jid);
        let isEnabled = groupSettings?.antiforeign === true;

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await m.reply('❌ I need admin privileges to enable Antiforeign.');
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (isEnabled === action) {
                return await m.reply(`✅ Antiforeign is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antiforeign', action);
            await m.reply(`✅ Antiforeign has been turned ${value.toUpperCase()} for this group.`);
        } else {
            await m.reply(
                `📄 Current Antiforeign setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\n` +
                `_Use ${prefix}antiforeign on or ${prefix}antiforeign off to change it._`
            );
        }
    });
};