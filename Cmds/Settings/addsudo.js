const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');
const { setSudoUser, isSudoUser } = require('../../config');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { m, args } = context;

    let numberToAdd;

    if (m.quoted) {
      numberToAdd = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
      numberToAdd = m.mentionedJid[0].split('@')[0];
    } else {
      numberToAdd = args[0];
    }

    if (!numberToAdd || !/^\d+$/.test(numberToAdd)) {
      return await m.reply('❌ Please provide a valid number or quote a user.');
    }

    const alreadySudo = await isSudoUser(numberToAdd);
    if (alreadySudo) {
      return await m.reply('⚠️ This number is already a sudo user.');
    }

    await setSudoUser(numberToAdd, true);
    await m.reply(`✅ ${numberToAdd} is now a Sudo User!`);
  });
};