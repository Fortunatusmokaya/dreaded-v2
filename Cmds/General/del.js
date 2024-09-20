module.exports = async (context) => {
    const { client, m, prefix } = context;

if (!m.quoted && !m.quoted.fromMe) return m.reply(`I cannot delete other users message, you can still delete it using ${prefix}delete command`);

await m.quoted.delete()
}