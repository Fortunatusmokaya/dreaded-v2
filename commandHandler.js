const fs = require('fs');
const path = require('path');

const cmdsDir = path.join(__dirname, 'Cmds');

function findAllCommandFiles(dir) {
    let commandFiles = [];
    let totalCommands = 0;

    function findFiles(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                findFiles(filePath);
            } else if (file.endsWith('.js')) {
                commandFiles.push(filePath);
                totalCommands++;
            }
        }
    }

    findFiles(dir);
    return { commandFiles, totalCommands };
}

const { commandFiles, totalCommands } = findAllCommandFiles(cmdsDir);

const commands = {};
const aliases = {};

commandFiles.forEach(file => {
    const commandModule = require(file);
    const commandName = path.basename(file, '.js');

    if (!commandModule.name) {
        commandModule.name = commandName;
    }

    commands[commandModule.name] = commandModule;

    if (commandModule.aliases && Array.isArray(commandModule.aliases)) {
        commandModule.aliases.forEach(alias => {
            aliases[alias] = commandModule.name; 
        });
    }
});

module.exports = { commands, aliases, totalCommands };