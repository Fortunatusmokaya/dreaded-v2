module.exports = async (context) => {

const { client, m, text, botname } = context;

try {

if (!text) return m.reply("Provide any media link...");

const {alldown} = require("nayan-media-downloader");
const url = text


  const data = await alldown(url);
const title = data.media.title;

await m.reply(title)

} catch (er) {

m.reply(er)

}

}


  





