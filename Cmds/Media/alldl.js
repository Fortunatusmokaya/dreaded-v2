module.exports = async (context) => {

const { client, m, text, botname } = context;
const { alldown } = require("nayan-media-downloader");

try {

if (!text) return m.reply("Provide any media link..nn .");

alldown(text).then(data => {
  m.reply(data.media.title)

    });



/*   const data = await alldown(text);



if (data && data.media) {



const info = data.media.title;
await m.reply('hey');

  await m.reply(info);
 
} else { m.reply("data inaccessible")
}
*/






} catch (er) {

await m.reply('Error\n' + er)

}

}


  





