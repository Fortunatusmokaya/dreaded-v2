const advice = require("badadvice");

module.exports = {
    name: "advice",
    aliases: ["advise"], 
    run: async ({ client, m }) => {
await m.reply(advice());

}
}