module.exports = async (context) => {

const { client, m, text, botname, fetchJson } = context;

if (!text) return m.reply("Provide a twitter or X link for the video");



try {

const data = await fetchJson(`https://api.dreaded.site/api/alldl?url=${text}`);


if (!data || data.status !== 200 || !data.data || !data.data.videoUrl) {
            return m.reply("We are sorry but the API endpoint didn't respond correctly. Try again later.");
        }



const twtvid = data.data.videoUrl;

await client.sendMessage(m.chat,{video : {url : twtvid },caption : `Downloaded by ${botname}`,gifPlayback : false },{quoted : m}) 

} catch (e) {

m.reply("An error occured. API might be down\n" + e)

}

}