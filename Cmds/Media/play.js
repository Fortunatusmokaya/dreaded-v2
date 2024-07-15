 const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");


module.exports = async (context) => {
    const { client, m, text } = context;     


if (!text) {
            m.reply('What song do you want to download?')
            return;
        }
        try {
            const {
                videos
            } = await yts(text);
            if (!videos || videos.length <= 0) {
                reply(`No songs found.`)
                return;
            }
            let urlYt = videos[0].url
            let infoYt = await ytdl.getInfo(urlYt);


            const getRandonm = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandonm(".mp3");
            const stream = ytdl(urlYt, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./${randomName}`));
            console.log("Audio downloading ->", urlYt);
            
            await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            


                await client.sendMessage(
                    m.chat, {
                        document: fs.readFileSync(`./${randomName}`),
                        mimetype: "audio/mpeg",
                        fileName: titleYt + ".mp3",
                    }, {
                        quoted: m
                    }
                );

            fs.unlinkSync(`./${randomName}`);
        } catch (e) {
            m.reply(e.toString())
        }
                     }
