const FormData = require("form-data");
const Jimp = require("jimp");

function getObfuscatedKeys() {
    return [
        "inferenceengine", "push", "21AoSGqU", "225006xOkcNu", "concat", "472390FPofBK",
        "4809828vvqtte", "data", "model_version", "3NUOcvQ", "14047187eKUyBb", "error",
        "3013792ZhnCJd", "okhttp/4.9.3", ".ai/", "enhance_image_body.jpg", "from",
        "10610670esKiBu", "append", "18nRsxLl", "submit", "https", "image", ".vyro",
        "image/jpeg", "enhance", "jimp", "24448HhNNWt", "1230ttmiGH", "Keep-Alive"
    ];
}

function getKey(index) {
    const keys = getObfuscatedKeys();
    return keys[index - 127];
}

async function enhanceWithVyro(imageBuffer, effect) {
    return new Promise((resolve, reject) => {
        const supported = ["enhance", "recolor", "dehaze"];
        if (!supported.includes(effect)) effect = supported[0];

        const form = new FormData();
        const url = `https://${getKey(128)}${getKey(151)}${getKey(142)}${effect}`;

        form.append(getKey(136), 1, {
            "Content-Transfer-Encoding": "binary",
            contentType: "multipart/form-data; charset=utf-8"
        });

        form.append(getKey(150), Buffer.from(imageBuffer), {
            filename: getKey(143),
            contentType: getKey(152)
        });

        form.submit({
            url,
            host: `${getKey(128)}${getKey(151)}.ai`,
            path: `/${effect}`,
            protocol: "https:",
            headers: {
                "User-Agent": getKey(141),
                Connection: getKey(127),
                "Accept-Encoding": "gzip"
            }
        }, (err, res) => {
            if (err) return reject(err);
            let chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => resolve(Buffer.concat(chunks)));
            res.on("error", reject);
        });
    });
}

module.exports = async (context) => {
    const { client, mime, m } = context;

    if (!/image/.test(mime)) {
        return m.reply("Please send or reply to an image.");
    }

    try {
        const media = await m.quoted.download();
        const enhancedImage = await enhanceWithVyro(media, "enhance");

        await client.sendMessage(m.chat, {
            image: enhancedImage,
            caption: 'Image has been enhanced to HD.'
        }, { quoted: m });

    } catch (err) {
        console.error("Error:", err);
        m.reply("An error occurred while processing the image.");
    }
};