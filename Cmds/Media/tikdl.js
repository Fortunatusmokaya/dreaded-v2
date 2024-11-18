const axios = require("axios");

module.exports = async (context) => {
    const { client, botname, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("Provide a TikTok link for the video.");
        if (!text.includes("tiktok.com")) return m.reply("That is not a valid TikTok link.");

        const data = await fetchJson(`https://api.dreaded.site/api/tiktok?url=${text}`);

        if (!data || data.status !== 200 || !data.tiktok || !data.tiktok.video) {
            return m.reply(`API Error: ${data?.message || "Invalid API response"}`);
        }

        const tikVideoUrl = data.tiktok.video;

        
        const response = await axios({
            url: tikVideoUrl,
            method: "GET",
            responseType: "arraybuffer",  
        });

        if (response.status !== 200) {
            return m.reply(`Failed to fetch video: HTTP ${response.status}`);
        }

        const videoBuffer = Buffer.from(response.data);

        await client.sendMessage(
            m.chat,
            {
                video: videoBuffer,
                caption: `Downloaded by ${botname}`,
            },
            { quoted: m }
        );
    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};