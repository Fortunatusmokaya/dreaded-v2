const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
    let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply('provide a valid YouTube link, eh ?');

        try {

            const primaryData = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${text}`);
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
                const fallbackData = await fetchJson(`https://api.dreaded.site/api/ytdl2/video?url=${text}`);
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