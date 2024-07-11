  
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");


module.exports = async (context) => {
    const { client, m, text } = context;

if (!text) {
        m.reply('Provide a search term for the video!');
        return;
    }
    try {
        const { videos } = await yts(text);
        if (!videos || videos.length <= 0) {
            m.reply(`No matching videos found!`);
            return;
        }

        const urlYt = videos[0].url;
        const infoYt = await ytdl.getInfo(urlYt);



        const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;
        const randomName = getRandom(".mp4");

        const stream = ytdl(urlYt, {
            filter: (info) => info.hasVideo && info.hasAudio,
        }).pipe(fs.createWriteStream(`./${randomName}`));

        console.log("Video downloading ->", urlYt);

        await new Promise((resolve, reject) => {
            stream.on("error", reject);
            stream.on("finish", resolve);
        });

        const fileSizeInBytes = fs.statSync(`./${randomName}`).size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        console.log("Video downloaded! Size: " + fileSizeInMegabytes + " MB");

            await client.sendMessage(
                m.chat,
                {
                    video: fs.readFileSync(`./${randomName}`),
                    mimetype: 'video/mp4',
                    caption: `${infoYt.videoDetails.title}`,
                },
                { quoted: m }
            );


        fs.unlinkSync(`./${randomName}`);
    } catch (e) {
        m.reply(e.toString());
    }
}