module.exports = async (context) => {

const { client, m, text, botname } = context;
const { alldown } = require("nayan-media-downloader");

try {

if (!text) return m.reply("Provide any media link...");





  const data = await alldown(text);
console.log(data);
/* 
if (data && data.media && data.media.title) {



const title = data && data.media.title;
const low = data.media.low;

await m.reply(title)
await m.reply(low) 

*/

} catch (er) {

await m.reply('Error\n' + er)

}

}


  





