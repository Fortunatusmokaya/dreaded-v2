module.exports = async (context) => {
    const { client, m, text } = context;

    try {

if (!text) return m.reply('Provide a text ?')
        const parts = m.sender.split('@')[0];


const response = await fetch(`https://gpt4.guruapi.tech/chat-gpt?username=${parts}&query=${text}`)

const data = await response.json()

let endres = data.result

await m.reply(endres);

} catch (error) {

await m.reply("An error occured\n" + error)

}

}