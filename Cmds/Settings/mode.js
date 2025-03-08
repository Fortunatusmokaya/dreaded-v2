const { updateSetting, getSettings } = require('../../Database/config'); 
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();
        
        
        const settings = await getSettings();  
        const prefix = settings.prefix;  

        if (value === 'public' || value === 'private') {
            if (settings.mode === value) {
                return await m.reply(`✅ Bot is already in ${value} mode.`);
            }
            await updateSetting('mode', value);
            await m.reply(`✅ Bot mode has been set to: ${value}`);
        } else {
            await m.reply(`📄 Current mode setting: ${settings.mode || 'undefined'}\n\nUse _${prefix}mode public_ or _${prefix}mode private_._`);
        }
    });
};