const { Boom } = require("@hapi/boom");
const { DateTime } = require("luxon");
const {
  default: dreadedConnect,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

const { getSettings, getSudoUsers, addSudoUser } = require("../Database/config");
const { commands, totalCommands } = require("../Handler/commandHandler");
const botname = process.env.BOTNAME || "DREADED";

const connectionHandler = async (client, update, startDreaded) => {
  const { connection, lastDisconnect } = update;

  const getGreeting = () => {
    const currentHour = DateTime.now().setZone("Africa/Nairobi").hour;
    if (currentHour >= 5 && currentHour < 12) return "Good morning 🌄";
    if (currentHour >= 12 && currentHour < 18) return "Good afternoon ☀️";
    if (currentHour >= 18 && currentHour < 22) return "Good evening 🌆";
    return "Good night 😴";
  };

  const getCurrentTimeInNairobi = () => {
    return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
  };

  if (connection === "connecting") {
    console.log("📈 Connecting to WhatsApp and database...");
  }

  if (connection === "close") {
    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
    if (reason === DisconnectReason.badSession) {
      console.log(`Bad Session File, Please Delete Session and Scan Again`);
      process.exit();
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log("Connection closed, reconnecting....");
      startDreaded();
    } else if (reason === DisconnectReason.connectionLost) {
      console.log("Connection Lost from Server, reconnecting...");
      startDreaded();
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
      process.exit();
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
      process.exit();
    } else if (reason === DisconnectReason.restartRequired) {
      console.log("Restart Required, Restarting...");
      startDreaded();
    } else if (reason === DisconnectReason.timedOut) {
      console.log("Connection TimedOut, Reconnecting...");
      startDreaded();
    } else {
      console.log(`Unknown DisconnectReason: ${reason} | ${connection}`);
      startDreaded();
    }
  } else if (connection === "open") {
    
      

    await client.groupAcceptInvite("HPik6o5GenqDBCosvXW3oe");

    const Myself = client.user.id.replace(/:.*/, "").split("@")[0];

    const settings = await getSettings();
    const currentDevs = await getSudoUsers();

    if (!currentDevs.includes(Myself)) {
      await addSudoUser(Myself);

      let newSudoMessage = `Holla, ${getGreeting()},\n\nYou are connected to dreaded bot. 📡\n\n`;
      newSudoMessage += `👤 BOTNAME:- ${botname}\n`;
      newSudoMessage += `🔓 MODE:- ${settings.mode}\n`;
      newSudoMessage += `✍️ PREFIX:- ${settings.prefix}\n`;
      newSudoMessage += `📝 COMMANDS:- ${totalCommands}\n`;
      newSudoMessage += `🕝 TIME:- ${getCurrentTimeInNairobi()}\n`;
      newSudoMessage += `💡 LIBRARY:- Baileys\n\n`;
      newSudoMessage += `▞▚▞▚▞▚▞▚▞▚▞▚▞\n\n`;
      newSudoMessage += `Looks like this is your first connection with this database, so we are gonna add to sudo users.\n\n`;
      newSudoMessage += `Now use the *${settings.prefix}settings* command to customize your bot settings.\n`;
      newSudoMessage += `To access all commands, use *${settings.prefix}menu*`;
newSudoMessage += `.....and maybe 🤔 thank you 🗿`;

      await client.sendMessage(client.user.id, { text: newSudoMessage });
    } else {
      let message = `Holla, ${getGreeting()},\n\nYou are connected to dreaded bot. 📡\n\n`;
      message += `👤 BOTNAME:- ${botname}\n`;
      message += `🔓 MODE:- ${settings.mode}\n`;
      message += `✍️ PREFIX:- ${settings.prefix}\n`;
      message += `📝 COMMANDS:- ${totalCommands}\n`;
      message += `🕝 TIME:- ${getCurrentTimeInNairobi()}\n`;
      message += `💡 LIBRARY:- Baileys\n\n`;
      message += `▞▚▞▚▞▚▞▚▞▚▞▚▞`;

      await client.sendMessage(client.user.id, { text: message });
    }

    console.log(`✅ Connection to WhatsApp and database successful\nLoaded ${totalCommands} commands.\nBot is active!`);
  }
};

module.exports = connectionHandler;