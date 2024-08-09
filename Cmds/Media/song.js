module.exports = async (context) => {
    const { client, m, text } = context;     


    if (!text) return m.reply(`Provide a song name to download!`);

    const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
    let yts = require("youtube-yts");
    let fs = require("fs");

    try {
        console.log('Starting song command processing...');
        const yt_play = await yts(text);
        console.log('Search results:', yt_play);

        if (!yt_play.videos || yt_play.videos.length === 0) {
            return reply('No video results found.');
        }

        let anup3k = yt_play.videos[0];
        console.log('Selected video:', anup3k);

        let additionalText = 'audio';

        let q = '128kbps';
        let v = anup3k.url;
        const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v));
        const dl_url = await yt.audio[q].download();
        const ttl = await yt.title;
        const size = await yt.audio[q].fileSizeH;

        await client.sendMessage(m.chat, {
            audio: { url: dl_url },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: ttl,
                    thumbnailUrl: anup3k.thumbnail,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    } catch (error) {
        console.error('Error processing song command:', error);
        m.reply('An error occurred while processing your request.\n\n' + error);
    }
}