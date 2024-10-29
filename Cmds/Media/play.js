const yts = require("yt-search");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) {
            return m.reply("What video do you want to download?");
        }

        const search = await yts(text);
        const link = search.all[0].url;

        // Fetch video data
        const data = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${link}`);

        // Check if the data contains the expected properties
        if (data && data.result && data.result.downloadLink && data.result.title) {
            await client.sendMessage(m.chat, {
                video: { url: data.result.downloadLink },
                mimetype: "video/mp4",
                fileName: `${data.result.title}.mp4`
            }, { quoted: m });

            await client.sendMessage(m.chat, {
                document: { url: data.result.downloadLink },
                mimetype: "video/mp4",
                fileName: `${data.result.title}.mp4`
            }, { quoted: m });
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        // Enhanced error handling
        m.reply("Download failed\n" + error.message);
        console.error("Download failed:", error);
    }
};






/* 
module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download ?")

        let search = await yts(text);
        console.log(search); // Log the search results

        if (!search || !search.all || !search.all[0] || !search.all[0].url) {
            m.reply("Invalid search results");
            return;
        }

        let link = search.all[0].url;

        let data = await fetchJson(`https://widipe.com/download/ytdl?url=${link}`);
        

        if (!data || !data.result || !data.result.mp3 || !data.result.title) {
            m.reply("Invalid data.");
            return;
        }

        await client.sendMessage(m.chat, {
            document: { url: data.result.mp3 },
            mimetype: "audio/mp3",
            fileName: `${data.result.title}.mp3`
        }, { quoted: m });
    } catch (error) {
        m.reply("Download failed\n" + error)
    }
}

*/
