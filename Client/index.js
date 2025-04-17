const {
  default: dreadedConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType,
} = require("@whiskeysockets/baileys");


const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
 const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../lib/exif');
 const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('../lib/botFunctions');
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

const authenticationn = require('../Auth/auth.js');
const { smsg } = require('../Handler/smsg');
const { getSettings, getBannedUsers, banUser, getGroupSetting } = require("../Database/config");


const { botname  } = require('../Env/settings');
const { DateTime } = require('luxon');
const { commands, totalCommands } = require('../Handler/commandHandler');
authenticationn();

const path = require('path');

const sessionName = path.join(__dirname, '..', 'Session'); 


const groupEvents = require("../Handler/eventHandler");
const groupEvents2 = require("../Handler/eventHandler2");
const connectionHandler = require('../Handler/connectionHandler');

// const connectionEvents = require("./connectionEvents.js");

async function startDreaded() {

let settingss = await getSettings();
        if (!settingss) return;

const { autobio, mode, anticall } = settingss;


        const {  saveCreds, state } = await useMultiFileAuthState(sessionName)
            const client = dreadedConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
version: [2, 3000, 1015901307],
        browser: [`DREADED`,'Safari','3.0'],
fireInitQueries: false,
            shouldSyncHistoryMessage: false,
            downloadHistory: false,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true,
            keepAliveIntervalMs: 30_000,
        auth: state,
        getMessage: async (key) => {
            if (store) {
                const mssg = await store.loadMessage(key.remoteJid, key.id)
                return mssg.message || undefined
            }
            return {
                conversation: "HERE"
            }
        }
    })


  store.bind(client.ev);




        setInterval(() => { store.writeToFile("store.json"); }, 3000);

if (autobio){ 
            setInterval(() => { 

                                 const date = new Date() 

                         client.updateProfileStatus( 

                                         `${botname} is active 24/7\n\n${date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} It's a ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi'})}.` 

                                 ) 

                         }, 10 * 1000) 

}

 
const processedCalls = new Set();

client.ws.on('CB:call', async (json) => {
    const settingszs = await getSettings();
    if (!settingszs?.anticall) return;

    const callId = json.content[0].attrs['call-id'];
    const callerJid = json.content[0].attrs['call-creator'];
    const callerNumber = callerJid.replace(/[@.a-z]/g, "");

    if (processedCalls.has(callId)) {
        return;
    }
    processedCalls.add(callId);

    try {
        await client.rejectCall(callId, callerJid);
        await client.sendMessage(callerJid, { text: "You will be banned for calling. Contact the owner!" });

        const bannedUsers = await getBannedUsers();
        if (!bannedUsers.includes(callerNumber)) {
            await banUser(callerNumber);
        }
    } catch (error) {
        console.error('Error handling call:', error);
    }
});


client.ev.on("messages.upsert", async (chatUpdate) => {
    let settings = await getSettings();
    if (!settings) return;

    const { autoread, autolike, autoview, presence, reactEmoji } = settings;

    try {
        mek = chatUpdate.messages[0];
        if (!mek.message) return;

        mek.message = Object.keys(mek.message)[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;

        const messageContent = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
        const isGroup = mek.key.remoteJid.endsWith("@g.us");
        const sender = mek.key.participant || mek.key.remoteJid;
        const Myself = await client.decodeJid(client.user.id);

        if (isGroup) {
            const antilink = await getGroupSetting(mek.key.remoteJid, "antilink");

            
            if ((antilink === true || antilink === 'true') && messageContent.includes("https") && sender !== Myself) {
                const groupMetadata = await client.groupMetadata(mek.key.remoteJid);
                const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                const isAdmin = groupAdmins.includes(sender);
                const isBotAdmin = groupAdmins.includes(Myself);

                if (!isBotAdmin) return;
                if (!isAdmin) {
                    await client.sendMessage(mek.key.remoteJid, {
                        text: `🚫 @${sender.split("@")[0]}, sending links is prohibited! You have been removed.`,
                        contextInfo: { mentionedJid: [sender] }
                    }, { quoted: mek });

                    await client.groupParticipantsUpdate(mek.key.remoteJid, [sender], "remove");

                    await client.sendMessage(mek.key.remoteJid, {
                        delete: {
                            remoteJid: mek.key.remoteJid,
                            fromMe: false,
                            id: mek.key.id,
                            participant: sender
                        }
                    });
                }
                return;
            }
        }

        // autolike for statuses
        if (autolike && mek.key.remoteJid === "status@broadcast") {
            if (!mek.status) {
                await client.sendMessage(mek.key.remoteJid, {
                    react: { key: mek.key, text: reactEmoji }
                });
            }
        }

        // autoview/ autoread
        if (autoview && mek.key.remoteJid === "status@broadcast") {
            await client.readMessages([mek.key]);
        } else if (autoread && mek.key.remoteJid.endsWith('@s.whatsapp.net')) {
            await client.readMessages([mek.key]);
        }

        // presence
        if (mek.key.remoteJid.endsWith('@s.whatsapp.net')) {
            const Chat = mek.key.remoteJid;
            if (presence === 'online') {
                await client.sendPresenceUpdate("available", Chat);
            } else if (presence === 'typing') {
                await client.sendPresenceUpdate("composing", Chat);
            } else if (presence === 'recording') {
                await client.sendPresenceUpdate("recording", Chat);
            } else {
                await client.sendPresenceUpdate("unavailable", Chat);
            }
        }

        // handle commands
        if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;

        m = smsg(client, mek, store);
        require("./dreaded")(client, m, chatUpdate, store);
    } catch (err) {
        console.log(err);
    }
});

  // Handle error
  const unhandledRejections = new Map();
  process.on("unhandledRejection", (reason, promise) => {
    unhandledRejections.set(promise, reason);
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("rejectionHandled", (promise) => {
    unhandledRejections.delete(promise);
  });
  process.on("Something went wrong", function (err) {
    console.log("Caught exception: ", err);
  });

  // Setting
  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };


  client.getName = (jid, withoutContact = false) => {
    id = client.decodeJid(jid);
    withoutContact = client.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = client.groupMetadata(id) || {};
        resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === client.decodeJid(client.user.id)
          ? client.user
          : store.contacts[id] || {};
    return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
  };


  client.public = true;

  client.serializeM = (m) => smsg(client, m, store);

  client.ev.on("group-participants.update", async (m) => {
    groupEvents(client, m);
groupEvents2(client, m);
  });

client.ev.on("connection.update", async (update) => {
  await connectionHandler(client, update, startDreaded);
});


  client.ev.on("creds.update", saveCreds);


  client.sendText = (jid, text, quoted = "", options) => client.sendMessage(jid, { text: text, ...options }, { quoted });

    client.downloadMediaMessage = async (message) => { 
         let mime = (message.msg || message).mimetype || ''; 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]; 
         const stream = await downloadContentFromMessage(message, messageType); 
         let buffer = Buffer.from([]); 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]) 
         } 

         return buffer 
      }; 




 client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => { 
         let quoted = message.msg ? message.msg : message; 
         let mime = (message.msg || message).mimetype || ''; 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]; 
         const stream = await downloadContentFromMessage(quoted, messageType); 
         let buffer = Buffer.from([]); 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]); 
         } 
         let type = await FileType.fromBuffer(buffer); 
         const trueFileName = attachExtension ? (filename + '.' + type.ext) : filename; 
         // save to file 
         await fs.writeFileSync(trueFileName, buffer); 
         return trueFileName; 
     };

}





app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});


app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

startDreaded();


module.exports = startDreaded;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
}); 