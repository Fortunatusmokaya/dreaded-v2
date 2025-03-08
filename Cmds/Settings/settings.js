const { getSettings, getSudoUsers } = require('../../Database/config');  
const { getBannedUsers } = require('../../Database/config');  

module.exports = async (context) => {
    const { client, m } = context;

    const settings = await getSettings();
    if (!settings) {
        return await m.reply("⚠️ No settings found in the database.");
    }

    let response = `*Current Settings*\n`;
    response += `🔘 *Botname*: ${process.env.BOTNAME || settings.botname}\n`; 
    response += `🔘 *Prefix*: ${settings.prefix}\n`;
    response += `🔘 *Autoread*: ${settings.autoread ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Autoview Status*: ${settings.autoview ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Autolike Status*: ${settings.autolike ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *React Emoji*: ${settings.reactEmoji}\n`;
    response += `🔘 *Sticker Watermark*: ${settings.packname}\n`;
    response += `🔘 *Autobio*: ${settings.autobio ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Anticall*: ${settings.anticall ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Presence*: ${settings.presence}\n`;

    const sudoUsers = await getSudoUsers();
    response += `\n*Statistics*\n`;
    response += `🔘 *Sudo Users*: ${sudoUsers.length > 0 ? sudoUsers.join(', ') : 'None'}\n`; 

    let getGroupzs = await client.groupFetchAllParticipating();
    let groupzs = Object.entries(getGroupzs)
        .slice(0)
        .map((entry) => entry[1]);
    let anaa = groupzs.map((v) => v.id);

    const bannedCount = await getBannedUsers();

    response += `🔘 *Banned Users*: ${bannedCount.length}\n`;  
    response += `🔘 *Total Groups*: ${anaa.length}\n`; 

    await m.reply(response);
};