const { getGroupSetting, getSudoUsers } = require("../Database/config");
const botname = process.env.BOTNAME || 'DREADED';


const Events = async (client, Fortu) => {
    const Myself = await client.decodeJid(client.user.id);

    try {
        

        let metadata = await client.groupMetadata(Fortu.id);
        let participants = Fortu.participants;
        let desc = metadata.desc || "No Description";


const groupSettings = await getGroupSetting(Fortu.id);
        const events = groupSettings?.events;
        const antidemote = groupSettings?.antidemote;
        const antipromote = groupSettings?.antipromote;
const sudoUsers = await getSudoUsers();


const DevDreaded = Array.isArray(sudoUsers) ? sudoUsers : [];
const currentDevs = DevDreaded.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net");



        for (let num of participants) {
            let dpuser;

            try {
                dpuser = await client.profilePictureUrl(num, "image");
            } catch {
                dpuser = "https://telegra.ph/file/0a620a1cf04d3ba3874f5.jpg";
            }

            if (events && Fortu.action === "add") {
                let userName = num;

                let Welcometext = `Holla @${userName.split("@")[0]} 👋\n\nWelcome to ${metadata.subject}.\n\nGroup Description: ${desc}\n\nThank You.\n\nThis is an automated message sent by ${botname} via Baileys.`;

                await client.sendMessage(Fortu.id, {
                    image: { url: dpuser },
                    caption: Welcometext,
                    mentions: [num],
                });
            } else if (Fortu.action === "remove" && events) {
                let userName2 = num;

                let Lefttext = `Goodbye @${userName2.split("@")[0]} 👋, probably not gonna miss you`;

                await client.sendMessage(Fortu.id, {
                    image: { url: dpuser },
                    caption: Lefttext,
                    mentions: [num],
                });
            } else if (Fortu.action === "demote") {
                if (antidemote) {
                    if (
                        Fortu.author == metadata.owner || 
                        Fortu.author == Myself || 
                        Fortu.author == Fortu.participants[0] || 
                        currentDevs.includes(Fortu.author)
                    ) {
                        await client.sendMessage(Fortu.id, {
                            text: `A super user has demoted @${(Fortu.participants[0]).split("@")[0]}`,
                            mentions: [Fortu.participants[0]]
                        });
                        return;
                    }

                    await client.groupParticipantsUpdate(Fortu.id, [Fortu.author], "demote");
                    await client.groupParticipantsUpdate(Fortu.id, [Fortu.participants[0]], "promote");

                    client.sendMessage(
                        Fortu.id,
                        {
                            text: `@${(Fortu.author).split("@")[0]} you will be demoted for demoting @${(Fortu.participants[0]).split("@")[0]}.\n\nAntidemote is active and only super users are allowed to demote!`,
                            mentions: [Fortu.author, Fortu.participants[0]]
                        }
                    );
                }
            } else if (Fortu.action === "promote") {
                if (antipromote) {
                    if (
                        Fortu.author == metadata.owner || 
                        Fortu.author == Myself || 
                        Fortu.author == Fortu.participants[0] || 
                        currentDevs.includes(Fortu.author)
                    ) {
                        await client.sendMessage(Fortu.id, {
                            text: `A super user has promoted @${(Fortu.participants[0]).split("@")[0]}`,
                            mentions: [Fortu.participants[0]]
                        });
                        return;
                    }

                    await client.groupParticipantsUpdate(Fortu.id, [Fortu.author, Fortu.participants[0]], "demote");

                    client.sendMessage(
                        Fortu.id,
                        {
                            text: `@${(Fortu.author).split("@")[0]} you have been demoted for promoting @${(Fortu.participants[0]).split("@")[0]} to admin. @${(Fortu.participants[0]).split("@")[0]} has also been demoted.\n\nAntipromote is active and only super users can promote!`,
                            mentions: [Fortu.author, Fortu.participants[0]]
                        }
                    );
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = Events; 