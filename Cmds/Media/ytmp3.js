module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

const path = require("path");
const ffmpeg = require("fluent-ffmpeg");


if (!text) return m.reply("Where is the YouTube link ?")

	let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
	if (!urls) return m.reply('Is this a YouTube link ?');
	let urlIndex = parseInt(text) - 1;
	if (urlIndex < 0 || urlIndex >= urls.length)
		return m.reply('Invalid URL.');
	

        let data = await fetchJson(`https://api.dreaded.site/api/ytdl/video?url=${text}`);
        let videoUrl = data.result.downloadLink;

let name = data.result.title;

        let outputFileName = `${name}.mp3`;
        let outputPath = path.join(__dirname, outputFileName);


        const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
        });


        ffmpeg(response.data)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", async () => {
                await client.sendMessage(
                    m.chat,
                    {
                        document: { url: outputPath },
                        mimetype: "audio/mp3",
                        fileName: outputFileName,
                    },
                    { quoted: m }
                );
                fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
                m.reply("Download failed\n" + err.message);
            });

    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};









