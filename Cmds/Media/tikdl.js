const fetch = require("node-fetch");

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

      
        const response = await fetch(tikVideoUrl);

        if (!response.ok) {
            return m.reply(`Failed to fetch video: HTTP ${response.status}`);
        }

        const videoBuffer = Buffer.from(await response.arrayBuffer());

await client.sendMessage(m.chat, {
  video: { url: tikVideoUrl },
mimetype: "video/mp4",
 fileName: `video.mp4`}, { quoted: m });


      
        
    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};