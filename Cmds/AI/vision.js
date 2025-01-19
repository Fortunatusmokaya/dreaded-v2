const axios = require('axios');

module.exports = async (context) => {
    const { client, mime, m, text, botname } = context;

    if (m.quoted && text) {
        const buffer = await m.quoted.download();


        if (!/image|pdf/.test(mime)) return m.reply("That's neither an image nor a PDF, quote a PDF document or an image with instructions.");

        const query = text;
        const base64String = buffer.toString('base64');

        await m.reply(`A moment, dreaded is analyzing the contents of the ${mime.includes("pdf") ? "PDF document" : "image"} you provided...`);

        try {
            const response = await axios.post('https://api.dreaded.site/api/gemini-analyze', {
                query: query,
                imageBuffer: base64String
            }, {
                headers: {
                    'Content-Type': 'application/json'  
                }
            });

            console.log(response.data);
            await m.reply(response.data.result);
        } catch (error) {
            const errorMessage = error.message || 'An unknown error occurred.';
            const maxErrorLength = 200;
            const replyMessage = errorMessage.length > maxErrorLength
                ? errorMessage.substring(0, maxErrorLength) + '...'
                : errorMessage;

            console.error("Error in sending request:", error);
            await m.reply(replyMessage);
        }
    } else {
        m.reply("Quote a PDF or image with instructions for bot to analyse.");
    }
}
