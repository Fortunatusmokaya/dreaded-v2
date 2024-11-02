module.exports = async (context) => {
    const { client, m, prefix } = context;

const botname = process.env.BOTNAME || "DREADED";

 await client.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/d6dab955fbaa42fce2280.jpg' }, caption: `Hello ${m.pushName}, Dreaded is active now.\n\nType ${prefix}menu.\nSome important links concerning the bot are given below.\n\nOfficial website:- https://dreaded.site\n\nPairing site:- https://pair.dreaded.site.\n\nRandom APIs site:\n\nhttps://api.dreaded.site \nThis free random APIs are meant for other developers and may not work always.\nXd );`, fileLength: "9999999999898989899999999" }, { quoted: m }); 

}