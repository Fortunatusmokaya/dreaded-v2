module.exports = async (context) => {
        const { client, m } = context;



if (!m.quoted) return m.reply("quote a viewonce message eh")

  const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    if (quotedMessage.imageMessage) {
      let imageCaption = quotedMessage.imageMessage.caption;
      let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
      client.sendMessage(m.chat, { image: { url: imageUrl }, caption: imageCaption });
    }

    if (quotedMessage.videoMessage) {
      let videoCaption = quotedMessage.videoMessage.caption;
      let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
      client.sendMessage(m.chat, { video: { url: videoUrl }, caption: videoCaption });
    }

   }