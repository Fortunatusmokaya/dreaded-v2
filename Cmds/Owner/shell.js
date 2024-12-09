const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, text, budy, prefix } = context; 

    try {
      const { exec, spawn, execSync } = require("child_process");

      
      const trimmedText = text.trim();

      

      
      if (!trimmedText || !trimmedText.startsWith(`${prefix}shell`) || trimmedText.length <= prefix.length + 6) {
        return m.reply(`Provide a shell command to execute! Example: ${prefix}shell ls`);
      }

      
      const command = trimmedText.slice(prefix.length + 6).trim(); 

      if (!command) {
        return m.reply("No valid command provided. Please provide a valid shell command.");
      }

      exec(command, (err, stdout, stderr) => {
        if (err) {
          return m.reply(`Error: ${err.message}`);
        }
        if (stderr) {
          return m.reply(`stderr: ${stderr}`);
        }
        if (stdout) {
          return m.reply(stdout);
        }
      });

    } catch (error) {
      await m.reply("An error occurred while running shell command\n" + error);
    }
  });
}