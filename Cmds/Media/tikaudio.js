module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide a TikTok link for the audio");
    }

    if (!text.includes("tiktok.com")) {
        return m.reply("That is not a TikTok link.");
    }

    try {
                let data = await fetchJson(`https://api.dreaded.site/api/tiktok?url=${text}`);


        if (!data || data.status !== 200 || !data.tiktok || !data.tiktok.music) {
            return m.reply("We are sorry but the API endpoint didn't respond correctly. Try again later.");
        }




        const tikaud = data.tiktok.music;
        


        if (!tikaud) {
            return m.reply("Invalid TikTok data. Please ensure the video exists.");
        }

await client.sendMessage(m.chat, {
  audio: {url: tikaud},
mimetype: "audio/mp3",
 fileName: `audioo.mp3`}, { quoted: m });


        
    } catch (e) {
        console.error("Error occurred:", e);
        m.reply("An error occurred. API might be down. Error: " + e);
    }
};