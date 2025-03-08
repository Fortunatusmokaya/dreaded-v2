const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m, isBotAdmin, isAdmin, Owner, body) => {
    if (!m.isGroup) return;

    const antilink = await getGroupSetting(m.chat, "antilink");

    if (!antilink || antilink === 'off') return; 

    if (body.includes("chat.whatsapp.com") && !Owner && isBotAdmin && !isAdmin) {
        m.reply("❌ Group link detected!");

        const kid = m.sender;

       
        await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: kid
            }
        });

        if (antilink === 'kick') {
           
            await client.groupParticipantsUpdate(m.chat, [kid], "remove");

            await client.sendMessage(m.chat, {
                text: `🚫 Removed!\n\n@${kid.split("@")[0]}, sending group links is prohibited!`,
                contextInfo: {
                    mentionedJid: [kid]
                }
            }, { quoted: m });
        } else if (antilink === 'del') {
           
            await m.reply(`⚠️ @${kid.split("@")[0]}, group links are not allowed! Message deleted.`, {
                contextInfo: { mentionedJid: [kid] }
            });
        }
    }
};