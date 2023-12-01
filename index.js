const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

const app = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const port = 8080;

app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/prompt-generator', async (req, res) => {
  console.log("request body: ", req.body);
  const { amount } = req.body;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: 'You are a helpful assistant creating poem prompts.' },
      { role: 'user', content: `Create ${amount} prompt(s) for a short poem` },
      { role: 'user', content: 'Order the prompt(s) in a list like so based on the amount of prompts requested: 1) "Refer to several different beverages" 2) "Include a childhood memory" These two are just examples, dont use them' }
    ]
  });

  if (response.data.choices[0]) {
    console.log("response", response)
    res.json({ message: response.data.choices[0].message.content });
  } else {
    res.json({ message: 'Error retrieving response' });
  }
});

app.listen(
  port, 
  () => {console.log('Server is running on port', port);}
);