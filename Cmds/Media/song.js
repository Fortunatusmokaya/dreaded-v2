const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");
            const {
                videos
            } = await yts(text);
            if (!videos || videos.length <= 0) {
                m.reply(`No songs found!`)
                return;
            }
            let urlYt = videos[0].url

        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/audio?url=${urlYt}`);
        let name = data.title;
        let audio = data.audioUrl;

        await m.reply(`_Downloading ${name}_`);


        await client.sendMessage(m.chat, {
 audio: {url: audio},
mimetype: "audio/mpeg",
 fileName: name }, { quoted: m });

    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};