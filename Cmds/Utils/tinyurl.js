module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("Please provide a URL to shorten.");
    }

    const urlRegex = /^(http:\/\/|https:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(text)) {
        return m.reply("That doesn't appear to be a valid URL.");
    }

    try {
        let data = await fetchJson(`https://api.dreaded.site/api/shorten-url?url=${encodeURIComponent(text)}`);

        if (!data || data.status !== 200 || !data.result || !data.result.shortened_url) {
            return m.reply("We are sorry, but the URL shortening service didn't respond correctly. Please try again later.");
        }

        const shortenedUrl = data.result.shortened_url;
        const originalUrl = data.result.original_url;

        await client.sendMessage(
            m.chat,
            {
                text: `*Original URL*: ${originalUrl}\n\n*Shortened URL*: ${shortenedUrl}`,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error occurred:", e);
        m.reply("An error occurred while shortening the URL. Please try again later.");
    }
};