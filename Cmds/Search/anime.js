module.exports = async (context) => {

const { client, m, text } = context;


const { Anime } = require("@shineiichijo/marika");
const Clientt = new Anime();


if (!text)
      return client.sendMessage(
        m.chat,
        { text: `Provide an anime name to search !` },
        { quoted: m }
      );

    var AnimesearchTerm = text.join(" ");
    let anime = await Clientt.searchAnime(AnimesearchTerm);

    let result = anime.data[0];
    let details = `       * Anime Search Engine  *\n\n\n*🎀 Anime Title:* ${result.title}\n`;
    details += `\n*🎋 Format:* ${result.type}\n`;
    details += `*📈 Status:* ${result.status
      .toUpperCase()
      .replace(/\_/g, " ")}\n`;
    details += `*🍥 Total episodes:* ${result.episodes}\n`;
    details += `*🎈 Duration:* ${result.duration}\n`;
    details += `*🧧 Genres:*\n`;
    for (let i = 0; i < result.genres.length; i++) {
      details += `\t\t\t\t\t\t\t\t${result.genres[i].name}\n`;
    }
    details += `\n*✨ Based on:* ${result.source.toUpperCase()}\n`;
    details += `*📍 Studios:*\n`;
    for (let i = 0; i < result.studios.length; i++) {
      details += `\t\t\t\t\t\t\t\t${result.studios[i].name}\n`;
    }
    details += `*🎴 Producers:*\n`;
    for (let i = 0; i < result.producers.length; i++) {
      details += `\t\t\t\t\t\t\t\t\t\t${result.producers[i].name}\n`;
    }
    details += `\n*🎐 Popularity:* ${result.popularity}\n`;
    details += `*🎏 Favorites:* ${result.favorites}\n`;
    details += `*🎇 Rating:* ${result.rating}\n`;
    details += `*🏅 Rank:* ${result.rank}\n\n`;
    details += `\n*🌐 URL:* ${result.url}\n\n`;

    await client.sendMessage(
      m.chat,
      { image: { url: result.images.jpg.large_image_url }, caption: details },
      { quoted: m });

} catch (e) {

m.reply('I did not find information on the given anime.')

}

}
