module.exports = async (context) => {
    const { client, m, mime, UploadFileUgu, TelegraPh, qmsg } = context;
 const fs = require("fs");
const util = require("util");

                let fta2 = await client.downloadAndSaveMediaMessage(qmsg)
                if (/image/.test(mime)) {
                    let fta = await TelegraPh(fta2)
                    m.reply(util.format(fta))
                } else if (!/image/.test(mime)) {
                    let fta = await UploadFileUgu(fta2)
                    m.reply(util.format(fta))
                }
                await fs.unlinkSync(fta2)

            }

