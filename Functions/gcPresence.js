const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m) => {
    if (!m.isGroup) return;

    const gcpresence = await getGroupSetting(m.chat, "gcpresence");

    if (gcpresence) {
        let presenceTypes = ["recording", "composing"];
        let selectedPresence = presenceTypes[Math.floor(Math.random() * presenceTypes.length)];
        await client.sendPresenceUpdate(selectedPresence, m.chat);
    }
};