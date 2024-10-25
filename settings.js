/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || '';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "263";
const author = process.env.STICKER_AUTHOR || '𝘚𝘛𝘙𝘐𝘒𝘌𝘙𝘉𝘖𝘠';
const packname = process.env.PACKNAME || 'sᴛʀɪᴋᴇʀʙᴏʏ 🤖';
const dev = process.env.DEV || '263784562833';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'sᴛʀɪᴋᴇʀʙᴏʏᵇᵒᵗ';
const mode = process.env.MODE || 'public';
const gcpresence = process.env.GC_PRESENCE || 'false';
const antionce = process.env.ANTIVIEWONCE || 'true';
const sessionName = "session";
const presence = process.env.WA_PRESENCE || 'online';

const antitag = process.env.ANTITAG || 'true';
const antidelete = process.env.ANTIDELETE || 'true';
const autoview = process.env.AUTOVIEW_STATUS || 'true';
const autoread = process.env.AUTOREAD || 'false';
const autobio = process.env.AUTOBIO || 'true';

module.exports = {
  sessionName,
  presence,
  autoview,
  autoread,
  botname,
  autobio,
  mode,
  prefix,
  mycode,
  author,
  packname,
  dev,
  DevDreaded,
  gcpresence,
  antionce,
session,
antitag,
antidelete
};
