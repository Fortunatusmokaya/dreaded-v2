//alive.js

module.exports = async (context) => {
    const { client, m, prefix } = context;

const botname = process.env.BOTNAME || "DREADED";

 await client.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/d6dab955fbaa42fce2280.jpg' }, caption: `Hello ${m.pushName}, Dreaded is active now.\n\nType ${prefix}menu to see my command list..\n\nSome important links concerning the bot are given below.\n\nOfficial website:\n https://dreaded.site\n\nPairing site:\n https://pair.dreaded.site.\n\nRandom APIs site:\nhttps://api.dreaded.site\n\nThis free random APIs are meant for other developers and may not always work.\n\nXd );`, fileLength: "9999999999898989899999999" }, { quoted: m }); 

}