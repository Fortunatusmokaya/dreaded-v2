const fetch = require('node-fetch');

module.exports = async (context) => {
    const { client, m, text, fetchJson, botname } = context;

    if (!text) return m.reply("What do you want to imagine?\n\n_Example:_ .imagine beautiful mountains with sunset");

    const apiUrl = `https://api.dreaded.site/api/imagine?text=${encodeURIComponent(text)}`;

    try {
        const data = await fetchJson(apiUrl);

        if (!data.status || !data.result) {
            return m.reply("Sorry, I couldn't generate the image. Please try again later.");
        }

        const { creator, result } = data;
        const caption = `_Created by: ${botname}_`;

        await client.sendMessage(
            m.chat,
            {
                image: { url: result },
                caption: caption
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        m.reply("An error occurred while generating the image.");
    }
};