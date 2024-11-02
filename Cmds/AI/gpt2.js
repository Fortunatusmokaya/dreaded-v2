module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;


if (!text) return m.reply("What's your question ?");

try {


const data = await fetchJson(`https://api.dreaded.site/api/gpt?text=${text}`)

const res = data.result;

await m.reply(res);

} catch (e) {
console.log(e);

 m.reply("Error occured") }



}