module.exports = async (context) => {
        const { client, m, text } = context;

try {
let Carbon = require("unofficial-carbon-now")

  if (!m.quoted && !text) return m.reply('Provide text code');
  let btt = new Carbon.createCarbon().setCode(m.quoted ? m.quoted.text : text)
  let qw = await Carbon.generateCarbon(btt)

console.log("Media generated");

// m.reply("media generated");

   await client.sendMessage(m.chat, { image: qw, caption: `Converted by Dreaded! 🦄`}, { quoted: m}) 

} catch (error) {

m.reply("Error occured.\n" + error)

}

}
  
