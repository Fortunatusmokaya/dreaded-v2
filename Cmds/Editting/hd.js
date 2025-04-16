const FormData = require("form-data");
const Jimp = require("jimp");

function getKeys() {
    return [
        "inferenceengine", "push", "21AoSGqU", "225006xOkcNu", "concat", "472390FPofBK",
        "4809828vvqtte", "data", "model_version", "3NUOcvQ", "14047187eKUyBb", "error",
        "3013792ZhnCJd", "okhttp/4.9.3", ".ai/", "enhance_image_body.jpg", "from",
        "10610670esKiBu", "append", "18nRsxLl", "submit", "https", "image", ".vyro",
        "image/jpeg", "enhance", "jimp", "24448HhNNWt", "1230ttmiGH", "Keep-Alive"
    ];
}

function getKey(index) {
    const keys = getKeys();
    return keys[index - 127];
}

async function enhanceImage(buffer, mode) {
    return new Promise((resolve, reject) => {
        let modes = ["enhance", "recolor", "dehaze"];
        if (!modes.includes(mode)) mode = "enhance";

        const form = new FormData();
        const endpoint = `https://inferenceengine.vyro.ai/${mode}`;
        form.append("model_version", 1, {
            "Content-Transfer-Encoding": "binary",
            contentType: "multipart/form-data; charset=utf-8"
        });
        form.append("image", Buffer.from(buffer), {
            filename: "enhance_image_body.jpg",
            contentType: "image/jpeg"
        });

        form.submit({
            url: endpoint,
            host: "inferenceengine.vyro.ai",
            path: "/" + mode,
            protocol: "https:",
            headers: {
                "User-Agent": "okhttp/4.9.3",
                Connection: "Keep-Alive",
                "Accept-Encoding": "gzip"
            }
        }, (err, res) => {
            if (err) return reject(err);
            const chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => resolve(Buffer.concat(chunks)));
            res.on("error", () => reject());
        });
    });
}

module.exports = async (context) => {
    const { client, mime, m } = context;

    if (m.quoted && /image/.test(mime)) {
        try {
            const buffer = await m.quoted.download();
            const result = await enhanceImage(buffer, "enhance");
            await client.sendMessage(m.chat, {
                image: result,
                caption: 'Your image has been enhanced to HD.'
            }, { quoted: m });
        } catch (error) {
            console.error("Error:", error);
            m.reply("An error occurred while processing the image.");
        }
    } else {
        m.reply("Please quote or send an image to enhance.");
    }
};