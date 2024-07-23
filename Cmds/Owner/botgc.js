const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;

try {

            let getGroupzs = await client.groupFetchAllParticipating();
            let groupzs = Object.entries(getGroupzs)
                .slice(0)
                .map((entry) => entry[1]);
            let anaa = groupzs.map((v) => v.id);
            let jackhuh = `Bot groups:-\n\n`
            await m.reply(`Bot is in ${anaa.length} groups, fetching and sending their jids!`)
            for (let i of anaa) {
                let metadat = await client.groupMetadata(i);
                await sleep(500)
                jackhuh += `Subject:- ${metadat.subject}\n`
                jackhuh += `Members: ${metadat.participants.length}\n`
                jackhuh += `Jid:- ${i}\n\n`

            }
          m.reply(jackhuh);


} catch (e) {

m.reply("Error occured while accessing bot groups" + e)

}

});

}

