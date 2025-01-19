module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide some text or query for chatgpt.");
    }

try {

const data = await fetchJson(`https://api.dreaded.site/api/chatgpt?text=${text}`);

if (data && data.result && data.result.prompt) {

const res = data.result.prompt;
await m.reply(res);

} else {

m.reply("Invalid response from API")

}

} catch (error) {

m.reply("Something went wrong...\n\n" + error)

}

}