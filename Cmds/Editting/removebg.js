module.exports = async (context) => {
    const { client, m, text, mime, uploadtoimgur } = context;

try {

const cap = "By Dreaded";

if (!m.quoted) return m.reply("Send the image then tag it with the command.");

   if (!/image/.test(mime)) return m.reply("That is not an image, try again while quoting an actual image.");             

let fdr = await client.downloadAndSaveMediaMessage(m.quoted)


                    let fta = await uploadtoimgur(fdr)
                    m.reply("A moment, dreaded is erasing the background. . .");

const image = `https://api.dreaded.site/api/removebg?imageurl=${fta}`


await client.sendMessage(m.chat, { image: { url: image }, caption: cap}, {quoted: m });

} catch (error) {

m.reply("An error occured...")

}

}
