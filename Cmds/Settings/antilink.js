const { getSettings, getGroupSetting, updateGroupSetting } = require('../../Database/config');
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

        let groupSettings = await getGroupSetting(jid);
        let currentMode = groupSettings?.antilink || 'off';

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if (value && !['kick', 'del', 'off'].includes(value)) {
            return await m.reply(
                `❌ Invalid option!\n\n_Use:_\n` +
                `- \`${prefix}antilink kick\` → *Kick* users who send links.\n` +
                `- \`${prefix}antilink del\` → *Delete* messages containing links.\n` +
                `- \`${prefix}antilink off\` → *Disable* antilink protection.`
            );
        }

        if (value === 'kick' || value === 'del') {
            if (!isBotAdmin) {
                return await m.reply('❌ I need admin privileges to enforce antilink.');
            }

            if (currentMode === value) {
                return await m.reply(`✅ Antilink is already set to *${value.toUpperCase()}*.`);
            }

            await updateGroupSetting(jid, 'antilink', value);
            await m.reply(`✅ Antilink mode updated to *${value.toUpperCase()}*.\n\n` +
                (value === 'kick' ? `_Users sending links will be removed!_` : `_Messages with links will be deleted!_`)
            );
        } else if (value === 'off') {
            if (currentMode === 'off') {
                return await m.reply(`✅ Antilink is already *OFF*.`);
            }

            await updateGroupSetting(jid, 'antilink', 'off');
            await m.reply(`✅ Antilink has been turned *OFF* for this group.`);
        } else {
            await m.reply(
                `📄 Current Antilink setting: *${currentMode.toUpperCase()}*\n\n` +
                `_Use:_\n` +
                `- \`${prefix}antilink kick\` → Kick users who send links.\n` +
                `- \`${prefix}antilink del\` → Delete messages containing links.\n` +
                `- \`${prefix}antilink off\` → Disable antilink.`
            );
        }
    });
};