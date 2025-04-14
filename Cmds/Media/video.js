module.exports = async (context) => {
    const { client, m, text } = context;
    const yts = require("yt-search");
    const fetch = require("node-fetch");

    if (!text) {
        return m.reply("Please provide a song name!");
    }

    try {
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            throw new Error("No songs found!");
        }

        const song = videos[0];

        const response = await fetch(`http://music.dreaded.site:3000/api/yt?url=${song.url}&format=mp4`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'video/mpeg'
            }
        });

        if (!response.ok) {
            throw new Error(`Download failed with status ${response.status}`);
        }

        await client.sendMessage(m.chat, {
            video: { url: response.url },
            mimetype: "video/mp3",
            fileName: `${song.title}.mp4`
        }, { quoted: m });

    } catch (error) {
        console.error("Error in video command:", error.message);
        return m.reply("Download failed: " + error.message);
    }
};