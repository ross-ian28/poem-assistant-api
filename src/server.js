// Import route files

// Define imports and dependencies
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

// Define mongodb dependencies
// const mongoose = require('mongoose');
// mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@poem-assistant-database.jtabmts.mongodb.net/?retryWrites=true&w=majority`)
// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     password: { type: String, required: true },
//     notes: { type: Array, required: false }
// });
// const UserModel = mongoose.model("poem-assistant-collection", UserSchema)

// Define port
const express = require('express');
const app = express();
const port = 8080;

// Enable .env file
require('dotenv').config()

// Set up cors and json parser
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

// Configure openapi 
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

// Get all users in database
// app.get('/users', (req, res) => {
//     UserModel.find({}, (error, result) => {
//         if (error) {
//             res.json({ message: `Error retrieving response: ${error}` });
//         } else {
//             res.json({ message: result });
//         }
//     })
// });

// app.post("/register", async (req, res) => {
//     const user = req.body;
//     const newUser = new UserModel(user);
//     await newUser.save();

//     res.json(user);
// })

module.exports = app;

// Run server on port 8080
if (require.main === module) {
    app.listen(port, () => {
      console.log('Server is running on port', port);
    });
}