module.exports = async (context) => {

const { client, m, text } = context;
try {
if (!text) return m.reply('Provide a WhatsApp channel link to stalk');

const fetch = require("node-fetch");

if (!text.includes('whatsapp.com/channel')) {
        return m.reply(`Doesnt look like a WhatsApp channel link, uh?`);
    }

const response = await fetch(`https://itzpire.com/stalk/whatsapp-channel?url=${text}`);

const data = await response.json()

const img = data.data.img;

await client.sendMessage(m.chat, { image: url: img}, caption: `Channel Name:- ${data.data.title}\n\nFollowers:- ${data.data.followers}\n\nDescription:- ${data.data.description}`}, {quoted: m})

}
