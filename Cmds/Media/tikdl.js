module.exports = async (context) => {

const { client, m, text, botname } = context;

if (!text) return m.reply("Provide a tiktok link for the video");

if (!text.includes('tiktok.com')) return m.reply("That is not a tiktok link.");

try {

const response = await fetch(`https://api.dreaded.site/api/tiktok?url=${text}`);
const data = await response.json();


const tikvid = data.tiktok.video;
const desc = data.tiktok.description;

await client.sendMessage(m.chat,{video : {url : tikvid },caption : `${desc}\nDownloaded by ${botname}`,gifPlayback : false },{quoted : m}) 

} catch (e) {

m.reply("An error occured. API might be down" + e)

}

}