module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

const yts = require("yt-search");
try {

if (!text) return m.reply("What song do you want to download ?")



        let data = await fetchJson (`https://api.dreaded.site/api/ytdl/video?query=${text}`)

let name = data.result.title;
await m.reply(`_Downloading ${name}_`)


await client.sendMessage(m.chat, {
 document: {url: data.result.audioLink},
mimetype: "audio/mpeg",
 fileName: name }, { quoted: m });



} catch (error) {

m.reply("Download failed\n" + error)

}

}