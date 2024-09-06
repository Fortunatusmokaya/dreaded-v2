const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, participants, botname, groupMetadata, text, pushname } = context;

        const { getBinaryNodeChild, getBinaryNodeChildren } = require('@whiskeysockets/baileys');

        if (!text) return m.reply("provide number to be added in this format.\n\nadd 254114018035");

        const _participants = participants.map((user) => user.id);

        const users = (await Promise.all(
            text.split(',')
                .map((v) => v.replace(/[^0-9]/g, ''))
                .filter((v) => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
                .map(async (v) => [
                    v,
                    await client.onWhatsApp(v + '@s.whatsapp.net'),
                ]),
        )).filter((v) => v[1][0]?.exists).map((v) => v[0] + '@c.us');

        const response = await client.query({
            tag: 'iq',
            attrs: {
                type: 'set',
                xmlns: 'w:g2',
                to: m.chat,
            },
            content: users.map((jid) => ({
                tag: 'add',
                attrs: {},
                content: [{ tag: 'participant', attrs: { jid } }],
            })),
        });

        

        

        const add = getBinaryNodeChild(response, 'add');
        const participant = getBinaryNodeChildren(add, 'participant');

        let respon = await client.groupInviteCode(m.chat);

        for (const user of participant.filter((item) => [401, 403, 408, 409, 500].includes(item.attrs.error))) {
    const jid = user.attrs.jid;
    const content = getBinaryNodeChild(user, 'add_request');
    const invite_code = content.attrs.code;
    const invite_code_exp = content.attrs.expiration;

    let teza;
    switch (user.attrs.error) {
        case 401:
            teza = `I got a status 401, @${jid.split('@')[0]} has blocked the bot.`;
            break;
        case 403:
            teza = `I got a status 403, @${jid.split('@')[0]} has privacy settings for group adding`;
            break;
        case 408:
            teza = `I got a status 408, @${jid.split('@')[0]} recently left the group...`;
            break;
case 409:
            teza = `What are you trying to do ? @${jid.split('@')[0]} is already in this group...`;
            break;
case 500:
            teza = `I got a status 500, Group is full...`;
            break;

        default:
            teza = `I cannot add @${jid.split('@')[0]} due to an unknown error,`;
    }

    await m.reply(teza);

    let links = `${pushname} is trying to add or request you to join the group ${groupMetadata.subject}:\n\nhttps://chat.whatsapp.com/${respon}\n\n${botname} 🤖`;

    await client.sendMessage(jid, { text: links }, { quoted: m });
}
    });
};