 const yts= require("yt-search")

const YT = require("../../lib/musicdl.js");
const fs = require("fs");


module.exports = async (context) => {
    const { client, m, text, fetchBuffer } = context;     


if (!text) {
            m.reply('What song do you want to download?')
            return;
        }
        try {
           let search = await yts(text);
            
let dreaded = search.videos[0]
const sk = await YT.mp3(dreaded.url)

await client.sendMessage(m.chat,{
    audio: fs.readFileSync(sk.path),
    fileName: dreaded.title + '.mp3',
    mimetype: 'audio/mpeg',
    contextInfo:{
        externalAdReply:{
            title:dreaded.title,
            body: "DREADED V2",
            thumbnail: await fetchBuffer(sk.meta.image),
            mediaType:2,
            mediaUrl:dreaded.url,
        }

    },
},{quoted:m})

            

            
        } catch (e) {
            m.reply(e.toString())
        }
    }

