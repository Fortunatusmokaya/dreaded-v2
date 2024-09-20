module.exports = async (context) => {
    const { client, m, prefix } = context;

if (m.quoted || m.quoted.fromMe === false) {
  return m.reply(`I cannot delete other users' messages, you can still delete using ${prefix}delete command`);
}

await m.quoted.delete()
}