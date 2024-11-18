const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("Provide a TikTok link for the video.");
        if (!text.includes("tiktok.com")) return m.reply("That is not a valid TikTok link.");

        const data = await fetchJson(`https://api.dreaded.site/api/tiktok?url=${text}`);

        if (!data || data.status !== 200 || !data.tiktok || !data.tiktok.video) {
            return m.reply(`API Error: ${data?.message || "Invalid API response"}`);
        }

        const tikVideoUrl = data.tiktok.video;
        const videoDesc = data.tiktok.description;

        const outputFileName = `TikTok_${Date.now()}.mp4`;
        const outputPath = path.join(__dirname, outputFileName);

        
        const response = await axios({
            url: tikVideoUrl,
            method: "GET",
            responseType: "stream", 
        });

        if (response.status !== 200) {
            return m.reply(`Failed to fetch video: HTTP ${response.status}`);
        }

       
        ffmpeg(response.data)
            .toFormat("mp4")
            .save(outputPath)
            .on("end", async () => {
                await client.sendMessage(
                    m.chat,
                    {
                        video: fs.createReadStream(outputPath),
                        caption: `Downloaded by TikTok Bot\n\nDescription: ${videoDesc}`,
                    },
                    { quoted: m }
                );
                fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
                m.reply(`FFmpeg Error: ${err.message}`);
            });

    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};