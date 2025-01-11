module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
            let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply('provide a valid YouTube link, eh ?');

        try {

                    let data = await fetchJson(`https://api.dreaded.site/api/ytdl/audio?url=${text}`);

        if (!data || !data.result || !data.result.download || !data.result.download.url) {
            return m.reply("Failed to fetch audio from the API.");
        }

        const {
            metadata: { title, thumbnail, duration, author },
            download: { url: audioUrl, quality, filename },
        } = data.result;



        await m.reply(`_Downloading ${title}_`);

        await client.sendMessage(
            m.chat,
            {
                document: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: filename,
            },
            { quoted: m }
        );

                await client.sendMessage(m.chat, {
 audio: {url: audioUrl },
mimetype: "audio/mpeg",
 fileName: filename }, { quoted: m });

        } catch (primaryError) {
            console.error("Primary API failed:", primaryError.message);


            try {
                const fallbackData = await fetchJson(`https://api.dreaded.site/api/ytdl2/audio?url=${text}`);
                if (!fallbackData || !fallbackData.result || !fallbackData.result.downloadUrl) {
                    throw new Error("Invalid response from fallback API");
                }

                const { title: name, downloadUrl: audio } = fallbackData.result;

                await m.reply(`_Downloading ${name}_`);
                await client.sendMessage(
                    m.chat,
                    {
                        audio: { url: audio },
                        mimetype: "audio/mpeg",
                        fileName: `${name}.mp3`,
                    },
                    { quoted: m }
                );

                        await client.sendMessage(m.chat, {
 document: {url: audio },
mimetype: "audio/mpeg",
 fileName: `${name}.mp3` }, { quoted: m });

            } catch (fallbackError) {
                console.error("Fallback API failed:", fallbackError.message);
                m.reply("Download failed: Unable to retrieve audio from both APIs.");
            }
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};