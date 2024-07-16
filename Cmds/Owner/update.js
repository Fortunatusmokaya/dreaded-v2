const simpleGit = require("simple-git");
const Heroku = require("heroku-client");
const herokuapi = process.env.HEROKUAPI || ''
const name = process.env.HEROKUNAME || ''

const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;

const heroku = new Heroku({ token: herokuapi })  

const git = simpleGit();    
await git.fetch();        
              var commits = await git.log(['main' + '..origin/' +'main']);

if (commits.total === 0) {        
                return m.reply('✅ Your bot is up to date with main branch!') }


else { m.reply("❌ Your bot is not up to date, update it by redeploying or syncing your fork")

}   


})

}