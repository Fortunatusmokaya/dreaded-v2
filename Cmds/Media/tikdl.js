const fetch = require("node-fetch");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    if (!text) {
        return m.reply("Provide a TikTok link for the video");
    }

    if (!text.includes("tiktok.com")) {
        return m.reply("That is not a TikTok link.");
    }

    try {
        const response = await fetch(`https://api.dreaded.site/api/tiktok?url=${text}`);

        if (!response.ok) {
            return m.reply(`We are sorry but the API endpoint didn't respond correctly. Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.status !== 200 || !data.tiktok || !data.tiktok.video) {
            return m.reply("We are sorry but the API endpoint didn't return the expected data. Try again later.");
        }

        const tikvid = data.tiktok.video;

        if (!tikvid) {
            return m.reply("Invalid TikTok data. Please ensure the video exists.");
        }

       
        const videoPath = path.resolve(__dirname, `tiktok_${Date.now()}.mp4`);

     
        ffmpeg(tikvid)
            .output(videoPath)
            .on("end", async () => {
               
                await client.sendMessage(
                    m.chat,
                    {
                        video: fs.createReadStream(videoPath),
                        caption: `Downloaded by ${botname}`,
                    },
                    { quoted: m }
                );

              
                fs.unlinkSync(videoPath);
            })
            .on("error", (err) => {
                console.error("FFmpeg error:", err.message);
                m.reply("An error occurred while processing the video. Please try again.");
            })
            .run();
    } catch (e) {
        console.error("Error occurred:", e);
        m.reply("An error occurred. API might be down. Error: " + e.message);
    }
};