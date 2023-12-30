app.post('/search', async (req, res) => {
    const { question } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a web search engine answering questions given to you.' },
        { role: 'user', content: `Answer my question to the best of your ability while keeping it short abd detailed also with no fluff: ${question}` }
        ]
    });
    
    if (response.data.choices[0]) {
        res.json({ message: response.data.choices[0].message.content });
    } else {
        res.json({ message: 'Error retrieving response' });
    }
});