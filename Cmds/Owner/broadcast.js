const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;

if (!text) return m.reply("Provide a broadcast message!");
if (!m.isGroup) return m.reply("This command is meant for groups");

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await m.reply("sending broadcast message...")

for (let i of res) { 


let txt = `BROADCAST MESSAGE *sᴛʀɪᴋᴇʀʙᴏʏ_вσt* \n\n🀄 Message: ${text}\n\nWritten by: ${pushname}\n\n> ©ᴍᴏᴋᴀʏᴀ & pσwєrєd вч sᴛʀɪᴋᴇʀʙᴏʏ` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://i.imgur.com/HGoTQf1.jpeg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }) 
         } 
await m.reply("Message sent across all groups");
})

}
