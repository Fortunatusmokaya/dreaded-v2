//ping.js

module.exports = async (context) => {
        const { client, m, dreadedspeed } = context;


await m.reply(`Pong\n${dreadedspeed.toFixed(4)}ms`)

}