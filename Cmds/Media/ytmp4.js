module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

try {

if (!text) return m.reply("Where is the YouTube link ?")

        let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply('Is this a YouTube link ?');
        let urlIndex = parseInt(text) - 1;
        if (urlIndex < 0 || urlIndex >= urls.length)
                return m.reply('Invalid URL.');


        let data = await fetchJson (`https://api.dreaded.site/api/ytdl/ytmp4?url=${text}`)
await client.sendMessage(m.chat, {
  video: {url: data.result.downloadLink},
mimetype: "video/mp4",
 fileName: `${data.result.title}.mp4`}, { quoted: m });

await client.sendMessage(m.chat, {
 document: {url: data.result.downloadLink},
mimetype: "video/mp4",
 fileName: `${data.result.title}.mp4` }, { quoted: m });


} catch (error) {

m.reply("Download failed\n" + error)

}

}