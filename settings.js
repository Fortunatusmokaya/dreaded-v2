/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOEczeXBkWkd6ZnE2UHptSzRMSkFmdmQ5cGV5bDc4dm43Sy9nb2tqMlVsOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ1hqbUltNmEwelZvRnQyNzlSeFFvUWVPR3dyTFRqQ2gvOWI5UTZlUkhWUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvTWV6TVQwRWQ3MHRZc2ptcXRkM1c0Si9XSlZuWUdYbHlMNTRSSmQyYm1BPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhS3NPZVVVM296SzNsUGt4RngvZCt3Rnp2dHEzSncraUlTL1I1QWNUeXh3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVCZE9hQy94Uzc2Mmpsa0Z6by9ZNXZ3SW9rdVhJVkt1b2s3MHAxMmU3MGM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkRONlhHQmRobGhEYzgydkFXUjYyRS9RTWdtMHJraTZDNlRXK2tuM1pXVG89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0VvQi9MUVp5K1JBaitqcERSUmZRaGN3eHhuWk94QWIrQTJBWGdNV0FuMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSTJxcExVc0JEcEx0WGlkazNnVmtzMzhtUUVLRkVyeU1JL0ZlVk44UlpYRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJJeE9CTWZkRXErN1QrY0RhLzJ0WFROYnZyMTEwd1VLMldVNjFONEJaNXZHUDYyTzNFdjhldW9yZjNlTnFOREVVTzQ4ZXg5ZmM3VFZXcjdVbFRGY0NBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTMsImFkdlNlY3JldEtleSI6IkdTSVJEcHZnVjNsNzFYdktFM2h3OEkxV01jUWp0Q05xQnZhQzZOV3hLVWc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0MTEzNjMxMjMyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjY2Q0Y2NzI0QzNCMzU4Q0Q1MEQ2QkM1QUFFNTlENjhEIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzA1MDA5MDB9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImUwTEdhNTZhVFJxd2pIUGJVVmhhY3ciLCJwaG9uZUlkIjoiZjdkOGNhYzItNmNhYy00N2QwLWEyM2EtMTQ4ZTkxYWQwYTMwIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdPNGVRRFllVkc1Zk5qalVpMFd6d2Q2TFhTbz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCeGY2cTZ6bUFtTjhNVHIzdmpXY1N5Mk5HMGc9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiWDRFNTRHV1giLCJtZSI6eyJpZCI6IjI1NDExMzYzMTIzMjoyOEBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJIdW1waHJleSBUdXZhIE5nYWxsYSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSzNKbnVNRkVJT3lsYmtHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiRlRiTjllT3J0SFJkYnRWMEJLeXRudEl1UTM3S21TcGxibklPZGRMU3JVVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoidGxwQ3ppUk1hS21naVdnTG1vY0wzMkZKc3dYZ05DMytXbkJkNXlMd0VVT1VFQ25lVzJ1Y0l6ZUxWMTc5WW84enZsNSs3YSt3dGx2UUxLNDJWQ2RNQXc9PSIsImRldmljZVNpZ25hdHVyZSI6InNhUGFYRzFsUEJ1QlVObmp2NHVsMEh5ajIycGtyMlh0N2lyczAyMlRjd0lxZXV2QXJGS1JrQmwxck05bWxiWVBHcVI2VEZGRFdQeVIvcTBHdVR6aUJRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0MTEzNjMxMjMyOjI4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlJVMnpmWGpxN1IwWFc3VmRBU3NyWjdTTGtOK3lwa3FaVzV5RG5YUzBxMUYifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzA1MDA4ODAsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTjh2In0=';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "254";
const author = process.env.STICKER_AUTHOR || 'fortunatus';
const packname = process.env.PACKNAME || 'dreaded md2 🤖';
const dev = process.env.DEV || '254114018035';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'DREADED';
const mode = process.env.MODE || 'public';
const gcpresence = process.env.GC_PRESENCE || 'false';
const antionce = process.env.ANTIVIEWONCE || 'true';
const sessionName = "session";
const presence = process.env.WA_PRESENCE || 'online';

const antitag = process.env.ANTITAG || 'true';
const antidelete = process.env.ANTIDELETE || 'true';
const autoview = process.env.AUTOVIEW_STATUS || 'true';
const autoread = process.env.AUTOREAD || 'true';
const autobio = process.env.AUTOBIO || 'false';

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
