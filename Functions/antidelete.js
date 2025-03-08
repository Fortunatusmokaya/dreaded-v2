const fs = require("fs");
const path = require("path");
const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m) => {
    if (!m.isGroup) return;

    const jid = m.chat;
    let groupSettings = await getGroupSetting(jid);

    if (!groupSettings || groupSettings.antidelete !== true) return;

    if (m.message.protocolMessage && m.message.protocolMessage.type === 0) {
        console.log("Deleted Message Detected!");
        let key = m.message.protocolMessage.key;

        try {
            const st = path.join(__dirname, "../Client/store.json");
            const datac = fs.readFileSync(st, "utf8");
            const jsonData = JSON.parse(datac);

            let messagez = jsonData.messages[key.remoteJid];
            let msgb;

            for (let i = 0; i < messagez.length; i++) {
                if (messagez[i].key.id === key.id) {
                    msgb = messagez[i];
                }
            }

            console.log(msgb);

            if (!msgb) {
                return console.log("Deleted message detected, error retrieving...");
            }

            await client.sendMessage(client.user.id, { forward: msgb }, { quoted: msgb });
        } catch (e) {
            console.log(e);
        }
    }
};