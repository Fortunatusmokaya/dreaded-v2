module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

        if (!text) return m.reply("What song do you want to download?");


try {


        let data = await fetchJson(`https://api.dreaded.site/api/spotifydl?title=${text}`);

if (data.success) {

await m.reply("Sending song in audio and document formats...");

const audio = data.result.downloadLink;

const filename = data.result.title

        await client.sendMessage(
            m.chat,
            {
                document: { url: audio },
                mimetype: "audio/mpeg",
                fileName: `${filename}.mp3`,
            },
            { quoted: m }
        );

await client.sendMessage(
            m.chat,
            {
                audio: { url: audio },
                mimetype: "audio/mpeg",
                fileName: `${filename}.mp3`,
            },
            { quoted: m }
        );


} else {

await m.reply("Failed to get a valid response from API endpoint");

}

} catch (error) {

m.reply("Unable to fetch download link, try matching exact song name or with artist name.")

}

}