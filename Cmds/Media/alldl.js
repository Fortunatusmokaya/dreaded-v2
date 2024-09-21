module.exports = async (context) => {

const { client, m, text, botname } = context;
const { alldown } = require("nayan-media-downloader");

try {

if (!text) return m.reply("Provide any media link...");





  const data = await alldown(text);




if (data && data.media) {
  await m.reply(`Title: ${data.media.title}`);
 
}







} catch (er) {

await m.reply('Error\n' + er)

}

}


  





