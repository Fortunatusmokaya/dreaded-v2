module.exports = async (context) => {

const { client, m, text, botname, fetchJson } = context;

if (!text) return m.reply("Provide any link for download.\nE.g:- FB, X, tiktok, capcut etc");



try {

const data = await fetchJson(`https://api.dreaded.site/api/alldl?url=${text}`);



const allvid = data.data.videoUrl;

await client.sendMessage(m.chat,{video : {url : allvid },caption : `Downloaded by ${botname}`,gifPlayback : false },{quoted : m}) 

} catch (e) {

m.reply("An error occured. API might be down\n" + e)

}

}