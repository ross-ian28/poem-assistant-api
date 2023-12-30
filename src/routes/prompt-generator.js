app.post('/prompt-generator', async (req, res) => {
    const { amount } = req.body;
  
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant creating a specified amount of poem prompts.' },
        { role: 'user', content: `Create ${amount} prompt for a short poem` },
        { role: 'user', content: 'Order the prompt(s) in a list like so based on the amount of prompts requested: 1) "Refer to several different beverages" 2) "Include a childhood memory" These two are just examples, dont use them' }
      ]
    });
  
    if (response.data.choices[0]) {
      res.json({ message: response.data.choices[0].message.content });
    } else {
      res.json({ message: 'Error retrieving response' });
    }
});