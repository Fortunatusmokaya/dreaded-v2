module.exports = async (context) => {

const { client, m, text, botname } = context;
const { alldown } = require("nayan-media-downloader");

try {

if (!text) return m.reply("Provide any media link...");





  const data = await alldown(text);
console.log(data);



if (data && data.media) {
  await m.reply(`Title: ${data.media.title}`);
  await m.reply(`Low quality video link: ${data.media.low}`);
  await m.reply(`High quality video link: ${data.media.high}`);
}







} catch (er) {

await m.reply('Error\n' + er)

}

}


  





