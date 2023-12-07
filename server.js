// Define imports and dependencies
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8080;

require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

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
    console.log("response", response)
    res.json({ message: response.data.choices[0].message.content });
  } else {
    res.json({ message: 'Error retrieving response' });
  }
});

app.post('/grammer-checker', async (req, res) => {
    const { message } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a poem writing assistant whos job is to help check the grammer of the text given' },
        { role: 'user', content: `Take this text: ${message}. And check for any grammer errors and places where the grammer can be improved` },
        { role: 'user', content: `After create a sepreate response for any spelling errors` }
        ]
    });
    
    if (response.data.choices[0]) {
        res.json({ message: response.data.choices[0].message.content });
    } else {
        res.json({ message: 'Error retrieving response' });
    }
});

app.post('/thesaurus', async (req, res) => {
    const { word } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a thesaurus giving words similiar to the word provided' },
        { role: 'user', content: `Take this word: ${word}. And give 10 synonyms and antonyms as example` }
        ]
    });
    
    if (response.data.choices[0]) {
        res.json({ message: response.data.choices[0].message.content });
    } else {
        res.json({ message: 'Error retrieving response' });
    }
});

app.post('/word-generator', async (req, res) => {
    const { amount } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a helpful assistant creating random words to inspire use in a poem.' },
        { role: 'user', content: `Create ${amount} word(s) to use in a short poem` },
        { role: 'user', content: 'Order the word(s) in a list like so based on the amount of words requested: 1) "Happy" 2) "Beautiful" These two are just examples, dont use them' }
        ]
    });
    
    if (response.data.choices[0]) {
        res.json({ message: response.data.choices[0].message.content });
    } else {
        res.json({ message: 'Error retrieving response' });
    }
});

app.post('/dictionary', async (req, res) => {
    const { word } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a dictionary giving the definition of the word provided.' },
        { role: 'user', content: `Give the definition of the word: ${word}` }
        ]
    });
    
    if (response.data.choices[0]) {
        res.json({ message: response.data.choices[0].message.content });
    } else {
        res.json({ message: 'Error retrieving response' });
    }
});

app.listen(
  port, 
  () => {console.log('Server is running on port', port);}
);