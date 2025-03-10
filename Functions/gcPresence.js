const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m) => {
    if (!m.isGroup) return;

    const groupSettings = await getGroupSetting(m.chat);
        const gcpresence = groupSettings?. gcpresence;
    if (gcpresence) {
        let presenceTypes = ["recording", "composing"];
        let selectedPresence = presenceTypes[Math.floor(Math.random() * presenceTypes.length)];
        await client.sendPresenceUpdate(selectedPresence, m.chat);
    }
};