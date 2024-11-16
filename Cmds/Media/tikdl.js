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
        const data = await response.json();

      
        console.log("API Response:", data);

       
        if (!data?.tiktok) {
            return m.reply("Failed to retrieve TikTok video data. Please try again later.");
        }

        const tikvid = data.tiktok.video;
        const desc = data.tiktok.description;

       
        if (!tikvid || !desc) {
            return m.reply("Invalid TikTok data. Please ensure the video exists.");
        }

        await client.sendMessage(
            m.chat,
            {
                video: { url: tikvid },
                caption: `${desc}\nDownloaded by ${botname}`,
                gifPlayback: false,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error occurred:", e);
        m.reply("An error occurred. API might be down. Error: " + e.message);
    }
};