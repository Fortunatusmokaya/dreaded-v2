module.exports = {
    name: "del",
  
    run: async ({ client, m, prefix }) => {



if (!m.quoted) return m.reply('Quote a message sent by bot');

if (m.quoted && m.quoted.fromMe === false) {
  return m.reply(`I cannot delete other users' messages, you can still delete using ${prefix}delete command`);
}


await m.quoted.delete()
}

}