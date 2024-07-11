module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("This is dreaded, an AI using Gemini APIs to process text, provide a text");

       
        const { default: Gemini } = await import('gemini-ai');

        const gemini = new Gemini("AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14");
        const chat = gemini.createChat();

        const res = await chat.ask(text);

        await m.reply(res);
    } catch (error) {
        m.reply("I cannot respond to harmful and offensive prompts, stick to ethical guidelines.");
    }
};
