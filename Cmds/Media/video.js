const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What video do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No videos found!");
        }

        const urlYt = videos[0].url;

        try {

            const primaryData = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${urlYt}`);
            if (!primaryData.success || !primaryData.result || !primaryData.result.download) {
                throw new Error("Invalid response from primary API");
            }

            const {
                metadata: { title: name },
                download: { url: videoUrl, filename },
            } = primaryData.result;

            await m.reply(`_Downloading ${name}_. . .`);
            await client.sendMessage(
                m.chat,
                {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: name,
                    fileName: filename || `${name}.mp4`,
                },
                { quoted: m }
            );

await client.sendMessage(
                m.chat,
                {
                    document: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: name,
                    fileName: filename || `${name}.mp4`,
                },
                { quoted: m }
            );


        } catch (primaryError) {
            console.error("Primary API failed:", primaryError.message);


            try {
                const fallbackData = await fetchJson(`https://api.dreaded.site/api/ytdl2/video?url=${urlYt}`);
                if (!fallbackData.success || !fallbackData.downloadUrl || !fallbackData.title) {
                    throw new Error("Invalid response from fallback API");
                }

                const { title: name, downloadUrl: videoUrl } = fallbackData;

                await m.reply(`_Downloading ${name}_`);
                await client.sendMessage(
                    m.chat,
                    {
                        video: { url: videoUrl },
                        mimetype: "video/mp4",
                        caption: name,
                        fileName: `${name}.mp4`,
                    },
                    { quoted: m }
                );

await client.sendMessage(
                    m.chat,
                    {
                        document: { url: videoUrl },
                        mimetype: "video/mp4",
                        caption: name,
                        fileName: `${name}.mp4`,
                    },
                    { quoted: m }
                );


            } catch (fallbackError) {
                console.error("Fallback API failed:", fallbackError.message);
                m.reply("Download failed: Unable to retrieve video from both APIs.");
            }
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};