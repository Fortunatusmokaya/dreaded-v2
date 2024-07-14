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
           
        let search = await yts(text)
        let anu = search.videos[0]
const pl= await YT.mp4(anu.url)

await client.sendMessage(m.chat,{
    document: {url:pl.videoUrl},
    fileName: anu.title + '.mp4',
    mimetype: 'video/mp4',
    contextInfo:{
        externalAdReply:{
            title:anu.title,
            body: "DREADED V2",
            thumbnail: await fetchBuffer(anu.thumbnail),
            mediaType:2,
            mediaUrl:anu.url,
        }

    },
},{quoted:m})

} catch (e) {

m.reply("Error occured" + e)}
    }