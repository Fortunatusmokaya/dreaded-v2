const { getGroupSetting, updateGroupSetting } = require('../../config');
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
        const currentSetting = await getGroupSetting(jid, 'antilink');

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if ((value === 'kick' || value === 'del') && !isBotAdmin) {
            return await m.reply('❌ I need admin privileges to handle the antilink feature.');
        }

        if (['kick', 'del', 'off'].includes(value)) {
            if (currentSetting === value) {
                return await m.reply(`✅ Antilink was already set to ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antilink', value);
            await m.reply(`✅ Antilink has been set to ${value.toUpperCase()} for this group.`);
        } else {
            await m.reply(
                `_📄 Current antilink setting for this group: ${currentSetting?.toUpperCase() || 'OFF'}_\n\n` +
                `_Use "${prefix}antilink kick", "${prefix}antilink del", or "${prefix}antilink off"._`
            );
        }
    });
};