const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (context) => {
    const { client, mime, m, text } = context;

    if (!text) return m.reply(`Example: _uhdpaper Anime, 5_`);

    let query, count;

    if (text.includes(',')) {
        const [queryText, countText] = text.split(',');
        query = queryText.trim();
        count = parseInt(countText.trim());
    } else {
        query = text.trim();
        count = null;
    }

    try {
        const results = await fetchWallpapers(query);

        if (results.length === 0) {
            return m.reply(`No results found for "${query}".`);
        }

        const max = count ? Math.min(results.length, count) : results.length;

        await m.reply(`Hold on, getting ${max} wallpaper(s)...`);

        for (let i = 0; i < max; i++) {
            const wallpaper = results[i];

            await client.sendMessage(m.chat, {
                image: { url: wallpaper.image },
                fileName: `wallpaper_${i + 1}.jpg`
            }, { quoted: m });

            if (i < max - 1) await new Promise(res => setTimeout(res, 1000));
        }

    } catch (err) {
        console.error(err);
        m.reply('Error while fetching wallpapers. Please try again later.');
    }
};

async function fetchWallpapers(query) {
    const searchUrl = `https://www.uhdpaper.com/search?q=${query}&by-date=true`;

    const { data } = await axios.get(searchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "Accept": "*/*"
        }
    });

    const $ = cheerio.load(data);
    let results = [];

    $('.post-outer').each((_, el) => {
        const title = $(el).find('h2').text().trim();
        const resolution = $(el).find('b').text().trim();
        const image = $(el).find('img').attr('src');
        const description = $(el).find('p').text().trim();
        const source = $(el).find('a').text().trim();
        const link = $(el).find('a').attr('href');

        results.push({ title, resolution, image, description, source, link });
    });

    return results;
}