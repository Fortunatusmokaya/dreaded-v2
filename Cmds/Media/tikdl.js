const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, botname, m, text, fetchJson } = context;

    const fetchTikTokData = async (url, retries = 3) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            const data = await fetchJson(url);
            if (
                data &&
                data.status === 200 &&
                data.tiktok &&
                data.tiktok.video &&
                data.tiktok.description &&
                data.tiktok.author.nickname &&
                data.tiktok.statistics.likeCount
            ) {
                return data;
            }
        }
        throw new Error("Failed to fetch valid TikTok data after multiple attempts.");
    };

    try {
        if (!text) return m.reply("Provide a TikTok link for the video.");
        if (!text.includes("tiktok.com")) return m.reply("That is not a valid TikTok link.");

        const url = `https://api.dreaded.site/api/tiktok?url=${text}`;
        const data = await fetchTikTokData(url);

        const tikVideoUrl = data.tiktok.video;
        const tikDescription = data.tiktok.description || "No description available";
        const tikAuthor = data.tiktok.author.nickname || "Unknown Author";
        const tikLikes = data.tiktok.statistics.likeCount || "0";
        const tikComments = data.tiktok.statistics.commentCount || "0";
        const tikShares = data.tiktok.statistics.shareCount || "0";

        const caption = `🎥 TikTok Video\n\n📌 *Description:* ${tikDescription}\n👤 *Author:* ${tikAuthor}\n❤️ *Likes:* ${tikLikes}\n💬 *Comments:* ${tikComments}\n🔗 *Shares:* ${tikShares}`;

        m.reply(`TikTok data fetched successfully! Sending...`);

        const response = await fetch(tikVideoUrl);

        if (!response.ok) {
            throw new Error(`Failed to download video: HTTP ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer(); 
        const videoBuffer = Buffer.from(arrayBuffer); 

        await client.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: "video/mp4",
            caption: caption,
        }, { quoted: m });

    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};