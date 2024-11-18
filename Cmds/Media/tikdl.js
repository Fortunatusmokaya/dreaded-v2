const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        
        if (!text) return m.reply("Provide a TikTok link for the video.");
        if (!text.includes("tiktok.com")) return m.reply("That is not a valid TikTok link.");

       
        const response = await axios.get(`https://api.dreaded.site/api/tiktok?url=${text}`);

        if (response.status !== 200 || !response.data.tiktok || !response.data.tiktok.video) {
            return m.reply("We are sorry, but the API endpoint didn't respond correctly. Try again later.");
        }

        const tikVideoUrl = response.data.tiktok.video;
        const videoDesc = response.data.tiktok.description;

        
        const outputFileName = `TikTok_${Date.now()}.mp4`;
        const outputPath = path.join(__dirname, outputFileName);

        
        const videoStream = await axios({
            url: tikVideoUrl,
            method: "GET",
            responseType: "stream",
        });

        if (videoStream.status !== 200) {
            return m.reply("Failed to download the TikTok video. Please try again later.");
        }

        ffmpeg(videoStream.data)
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
                console.error("FFmpeg Error:", err.message);
                m.reply("An error occurred while processing the video. Please try again.");
            });

    } catch (error) {
        console.error("Error:", error.message);
        m.reply("An error occurred. Error: " + error.message);
    }
};