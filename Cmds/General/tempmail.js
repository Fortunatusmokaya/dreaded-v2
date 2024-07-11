module.exports = async (context) => {
        const { client, m } = context;

const Email = 'https://tempmail.apinepdev.workers.dev/api/gen';


const response = await fetch(Email);
            const data = await response.json();

if (!data || !data.email) {

                return m.reply("Unable to fetch temporary email. Try again later...");
            }


const newEmail = data.email;




const mas = await client.sendMessage(m.chat, { text: newEmail });

await client.sendMessage(m.chat, { text: `Quoted text is your temporary email. Use it to sign up online. To fetch messages in your email use <.tempinbox your-email>`}, { quoted: mas});




}

