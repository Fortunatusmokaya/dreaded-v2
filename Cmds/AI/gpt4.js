module.exports = async (context) => {
    const { client, m, text } = context;


const ai = require('unlimited-ai');


 (async () => { 

const model = 'gpt-4'; 


const messages = [ { role: 'user', content: 'Hello!' }, { role: 'system', content: 'You are an assistant' } ]; 

await m.reply(await ai.generate(model, messages)); 

})();


}