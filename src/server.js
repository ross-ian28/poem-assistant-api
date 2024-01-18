// OpenAI dependencies
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);


// ExpressJS Dependencies
const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Middleware Dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:3000", "https://poem-assistant-ui.vercel.app"]
  };
app.use(cors(corsOptions));

const cookieSession = require('cookie-session');
const crypto = require('crypto');
process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
}));


// Mongoose Dependencies
const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://admin:${process.env.MONGO_PASS}@poem-assistant-cluster.hgrcpsz.mongodb.net/poem-assistant-database`;

// Connect to MongoDB
mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: String,
    notes: Array
});
const User = mongoose.model('User', userSchema);


// API Endpoints
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

app.post('/signup', async (req,res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            notes: []
        })
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up user', error);
        res.status(500).json({ message: 'Error signing up user', error });
    }
});

app.post('/login', async (req,res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            // Set the token in a cookie
            req.session.token = token;
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        } 
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

app.get('/notes', (req, res) => {
    if (!req.session.token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(req.session.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ message: 'Protected route accessed', user: decoded });
    });
});

module.exports = app;

// Run server on port 8080
if (require.main === module) {
    app.listen(port, () => {
      console.log('Server is running on port', port);
    });
}