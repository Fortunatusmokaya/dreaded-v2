module.exports = {
    name: "ping",
    aliases: ["speed", "latency"], 
    run: async ({ client, m, dreadedspeed }) => {
        await m.reply(`Pong\n${dreadedspeed.toFixed(4)}ms`);
    }
};