const { getGroupSetting, updateGroupSetting, getSettings } = require('../../config');
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
        const currentSetting = await getGroupSetting(jid, 'antiforeign');

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await m.reply('❌ I need admin privileges to handle the antiforeign feature.');
        }

        if (value === 'on' || value === 'off') {
            if (currentSetting === value) {
                return await m.reply(`✅ Antiforeign was already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antiforeign', value);
            if (value === 'on') {
                await m.reply(`✅ Antiforeign has been turned ON for this group. _Bot will now automatically remove non-${mycode} numbers joining!_`);
            } else {
                await m.reply(`❌ Antiforeign has been turned OFF for this group.`);
            }
        } else {
            await m.reply(
                `_📄 Current antiforeign setting for this group: ${currentSetting?.toUpperCase() || 'OFF'}_\n\n` +
                `_Use "${prefix}antiforeign on" or "${prefix}antiforeign off"._`
            );
        }
    });
};