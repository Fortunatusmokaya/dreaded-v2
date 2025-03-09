const { DateTime } = require('luxon');
const fs = require('fs');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix, pict } = context;

    try {
        const categories = [

            { name: 'General', emoji: '✍️' },
            { name: 'Settings', emoji: '⚙️' },
{ name: 'Owner', emoji: '👑' },
{ name: 'Wa-Privacy', emoji: '🪀' },
{ name: 'Groups', emoji: '👥' },
{ name: 'AI', emoji: '🤖' },

            { name: 'Media', emoji: '🎥' },
            { name: 'Editting', emoji: '✂️' },
            { name: 'Groups', emoji: '👥' },
            { name: 'Random', emoji: '👾' }
        ];

        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;

            if (currentHour >= 5 && currentHour < 12) {
                return 'Good morning 🌄';
            } else if (currentHour >= 12 && currentHour < 18) {
                return 'Good afternoon ☀️';
            } else if (currentHour >= 18 && currentHour < 22) {
                return 'Good evening 🌆';
            } else {
                return 'Good night 😴';
            }
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        let menuText = `Holla, ${getGreeting()},\n\n`;

        menuText += `👥 𝑼𝑺𝑬𝑹:- ${m.pushName}\n`;
        menuText += `👤 𝑩𝑶𝑻𝑵𝑨𝑴𝑬:- ${botname}\n`;
        menuText += `📝 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺:- ${totalCommands}\n`;
        menuText += '🕝 𝑻𝑰𝑴𝑬:- ' + getCurrentTimeInNairobi() + '\n';
        menuText += `✍️ 𝑷𝑹𝑬𝑭𝑰𝑿:- ${prefix}\n`;
        menuText += `🔓 𝑴𝑶𝑫𝑬:- ${mode}\n`;
        menuText += '💡 𝑳𝑰𝑩𝑹𝑨𝑹𝒀:- Baileys\n';

        menuText += '━━━━━━━\n';
        menuText += '━━━━━━\n';
        menuText += '━━━━━━━\n\n';

        const toLightUppercaseFont = (text) => {
            const fonts = {
                'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔',
                'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toLightLowercaseFont = (text) => {
            const fonts = {
                'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮',
                'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Commands/${category.name}`).filter((file) => file.endsWith('.js'));

            const fancyCategory = toLightUppercaseFont(category.name.toUpperCase());

            menuText += `*${fancyCategory} ${category.emoji}:* \n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toLightLowercaseFont(commandName);
                menuText += `  • ${fancyCommandName}\n`;
            }

            menuText += '\n';
        }



await client.sendMessage(m.chat, {
                        text: menuText,
                        contextInfo: {
                            externalAdReply: {
                                showAdAttribution: false,
                                title: `DREADED V3`,
                                body: `Hi ${m.pushName}`,
                                thumbnail: pict,
                                sourceUrl: `https://github.com/Fortunatusmokaya/dreaded-v3`,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {
                        quoted: m
                    })

    } catch (error) {
        console.error(error);
        m.reply('An error occurred while fetching the menu.\n' + error);
    }
};