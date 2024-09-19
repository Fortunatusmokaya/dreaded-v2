const axios = require('axios');
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const {youtubedl, youtubedlv2} = require('@bochilteam/scraper');

module.exports = async (context) => {
    const { client, m, text, ytmp3 } = context;

async function search(query, options = {}) {
  const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
  return search.videos;
} 



const getBuffer = async (url, options) => {
    options ? options : {};
    const res = await axios({method: 'get', url, headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1,}, ...options, responseType: 'arraybuffer'});
    return res.data;
};


try {

if (!text) {
            m.reply('What song do you want to download?')
            return;
        }



const yt_play = await search(text);



const { status, results, error } = await ytmp3(yt_play[0].url);


const ttl = results.title;

await m.reply(`_Downloading ${ttl}_`);
      const buff_aud = await getBuffer(results.download);
      

        await client.sendMessage(m.chat, { document: buff_aud, mimetype: 'audio/mpeg', fileName: text + `.mp3` }, { quoted: m });
      
     


} catch (er) {

m.reply('Error\n' + er)

}


  }