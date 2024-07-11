const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner, args } = context;

                 if (!text) return m.reply("provide a valid group link")
                let result = args[0].split('https://chat.whatsapp.com/')[1] 
                 await client.groupAcceptInvite(result).then((res) =>  m.reply(jsonformat(res))).catch((err) =>m.reply(`Trying to join. . .`)) 

             });
}
