const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner, generateProfilePicture, botNumber, mime, msgDreaded } = context;

try {
const fs = require("fs");

if(!msgDreaded) { m.reply('Quote an image...') ; return } ;


let media;
if (msgDreaded.imageMessage) {
     media = msgDreaded.imageMessage

  } else {
    m.reply('This is not an image...'); return
  } ;

var medis = await client.downloadAndSaveMediaMessage(media);



                    var {
                        img
                    } = await generateProfilePicture(medis)






client.query({
                tag: 'iq',
                attrs: {
                    target: undefined,
                    to: S_WHATSAPP_NET,
                    type:'set',
                    xmlns: 'w:profile:picture'
                },
                content: [
                    {
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: img
                    }
                ]
            })
                    
                    fs.unlinkSync(medis)
                    m.reply("Bot Profile Picture Updated")

} catch (error) {

m.reply("An error occured while updating bot profile photo\n" + error)

}

                })




}
