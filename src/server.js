// OpenAI dependencies
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;


// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);


// Express
const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Middleware Dependencies
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:3000", "https://poem-assistant-ui.vercel.app"]
  };
app.use(cors(corsOptions));
const cookieSession = require("cookie-session");


// MongoDB Dependencies
const { MongoClient } = require('mongodb');
const mongoURI = `mongodb+srv://admin:${process.env.MONGO_PASS}@poem-assistant-cluster.odlq8ic.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongoURI);


// Connect to MongoDB
client.connect().then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
});


// Define API Endpoints
app.post('/prompt-generator', async (req, res) => {
  const { amount } = req.body;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: 'You are a helpful assistant creating a specified amount of poem prompts.' },
      { role: 'user', content: `Create "${amount}" prompt for a short poem` },
      { role: 'user', content: 'Order the prompt(s) in a list like so based on the amount of prompts requested: 1) "Refer to several different beverages" 2) "Include a childhood memory" These two are just examples, dont use them' }
    ]
  });

  if (response.data.choices[0]) {
    res.json({ message: response.data.choices[0].message.content });
  } else {
    res.json({ message: 'Error retrieving response' });
  }
});

app.post('/grammar-checker', async (req, res) => {
    const { message } = req.body;
    
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
        { role: 'system', content: 'You are a poem writing assistant whos job is to help check the grammar of the text given' },
        { role: 'user', content: `Take this text: ${message}. And check for any grammar errors and places where the grammar can be improved` },
        { role: 'user', content: `After create a separate response for any spelling errors` }
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
        { role: 'user', content: `Create "${amount}" word(s) to use in a short poem` },
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

app.get('/users', async (req, res) => {
    const database = client.db("poem-assistant-collection");
    const collection = database.collection("users");

    try {
        const result = await collection.find();
        res.json({ message: 'Users found successfully', data: result });
    } catch (error) {
        console.error('Error signing up user', error);
        res.status(500).json({ message: 'Error signing up user' });
    }
});

app.post('/signup', async (req,res) => {
    const database = client.db("poem-assistant-collection");
    const collection = database.collection("users");
    const { username, password } = req.body;

    try {
        const result = await collection.insertOne({ username, password });
        res.json({ message: 'User signed up successfully', data: result });
    } catch (error) {
        console.error('Error finding users', error);
        res.status(500).json({ message: 'Error finding users' });
    }
});

module.exports = app;

// Run server on port 8080
if (require.main === module) {
    app.listen(port, () => {
      console.log('Server is running on port', port);
    });
}