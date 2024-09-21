/* const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
const fs = require('fs');
module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner, prefix } = context;

if (!text) return m.reply(`Provide name of command to fetch it's code. Like, ${prefix}getcmd fullpp`);

const fs = require('fs');
const categories = [
    { name: 'AI' },
    { name: 'General' },
    { name: 'Media' },
    { name: 'Editting' },
    { name: 'groups' },
    { name: 'Owner' },
    { name: 'Coding' }
];

for (const category of categories) {
    const fileName = text
    const filePath = `./Cmds/${category.name}/${fileName.endsWith('.js') ? fileName : `${fileName}.js`}`;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            m.reply(`Error reading file:-\n ${err.message}`);
        } else {
            m.reply(`\`\`\`${data}\`\`\``);
        }
    });
}

});

}

*/

module.exports = async (context) => {
 const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 
const fs = require('fs');
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner, prefix } = context;

        if (!text) return m.reply(`Provide name of command to fetch it's code. Like, ${prefix}getcmd fullpp`);

        const categories = [
            { name: 'AI' },
            { name: 'General' },
            { name: 'Media' },
            { name: 'Editting' },
            { name: 'groups' },
            { name: 'Owner' },
            { name: 'Coding' }
        ];

        let fileFound = false;

        for (const category of categories) {
            const fileName = text
            const filePath = `./Cmds/${category.name}/${fileName.endsWith('.js') ? fileName : `${fileName}.js`}`;

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    // File doesn't exist, move on to the next category
                    return;
                }

                // File exists, read it and reply with the contents
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        m.reply(`Error reading file:-\n ${err.message}`);
                    } else {
                        m.reply(`\`\`\`${data}\`\`\``);
                        fileFound = true;
                    }
                });
            });
        }

        if (!fileFound) {
            m.reply(`Command not found: ${text}`);
        }
    });
};