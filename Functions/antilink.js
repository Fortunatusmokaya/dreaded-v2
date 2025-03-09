/* const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m, isBotAdmin, isAdmin, Owner, body) => {
    if (!m.isGroup) return;

  
    const groupSettings = await getGroupSetting(m.chat);

    
    const antilink = groupSettings?.antilink?.trim().toLowerCase(); 

    

    if (!antilink || antilink === "off") return; 

   
    if (body.includes("chat.whatsapp.com") && !Owner && isBotAdmin && !isAdmin) {
        const kid = m.sender;

        if (antilink === "del") {
           

            await client.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: kid
                }
            });

            await client.sendMessage(m.chat, {
                text: `⚠️ @${kid.split("@")[0]}, group links are not allowed! Message deleted.`,
                contextInfo: { mentionedJid: [kid] }
            });
        } 
        else if (antilink === "kick") {
          

            await client.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: kid
                }
            });

            await client.groupParticipantsUpdate(m.chat, [kid], "remove");

            await client.sendMessage(m.chat, {
                text: `🚫 Removed!\n\n@${kid.split("@")[0]}, sending group links is prohibited!`,
                contextInfo: {
                    mentionedJid: [kid]
                }
            });
        } else {
            console.log("Unexpected antilink value:", antilink);
        }
    }
};

*/