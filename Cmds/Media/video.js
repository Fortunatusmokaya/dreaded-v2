const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What video do you want to download?");
            const {
                videos
            } = await yts(text);
            if (!videos || videos.length <= 0) {
                m.reply(`No videos found!`)
                return;
            }
            let urlYt = videos[0].url

        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${urlYt}`);
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