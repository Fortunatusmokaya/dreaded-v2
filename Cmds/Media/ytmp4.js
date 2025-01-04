const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply('provide a valid YouTube link, eh ?');

    try {


        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${text}`);
        let name = data.title;
        let video = data.videoUrl;

        await m.reply(`_Downloading ${name}_`);


                await client.sendMessage(m.chat, {
 video: {url: video},
mimetype: "video/mp4", caption: name,
 fileName: name }, { quoted: m });


await client.sendMessage(m.chat, {
 document: {url: video},
mimetype: "video/mp4", caption: name,
 fileName: name }, { quoted: m });





    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};