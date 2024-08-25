module.exports = async (context) => {
        const { client, m } = context;



  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.sender
        

let img;

            try {
                img = await client.profilePictureUrl(who, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }


const imagelink = `https://some-random-api.com/canvas/misc/simpcard?avatar=${img}`;

await client.sendMessage(m.chat, { image: { url: imagelink }});

}

