module.exports = async (client, m, isBotAdmin, itsMe, isAdmin, Owner, body, antitag) => {


if (m.isGroup && antitag === 'true' && !Owner && !isBotAdmin && !isAdmin && m.mentionedJid && m.mentionedJid.length > 10) {
if (itsMe) return;




await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

cona = m.sender;
await client.sendMessage(m.chat, {text:`@${cona.split("@")[0]}, Do not tag!`, contextInfo:{mentionedJid:[cona]}}, {quoted:m}); 

}

}