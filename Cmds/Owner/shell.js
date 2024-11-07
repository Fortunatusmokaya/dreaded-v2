const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {

        const { client, m, text, budy} = context;

const { exec, spawn, execSync } = require("child_process");

    
  if (!text) return m.reply("Provide a shell command to execute!")
  exec(text.slice(2), (err, stdout) => {
if(err) return m.reply(err)
if (stdout) return m.reply(stdout)
  })
   });

}