module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("What's your question?");
    }

    try {
        const data = await fetchJson(`https://api.dreaded.site/api/gpt?text=${encodeURIComponent(text)}`);

        if (data.success) {
            const res = data.result;
            await m.reply(res);
        } else {
            await m.reply("Failed to get a response from the API.");
        }

    } catch (e) {
        console.log(e);
        m.reply("An error occurred while processing your request.");
    }
};