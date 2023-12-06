<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="./logo.png" alat="Logo" width="20%" height="20%" >
  <h1 align="center">Poem Assistant</h1>
  <p align="center">
    A helpful assistant that puts your poem writing tools all in one place
    <br />
    <br />
  </p>
</div>

## About The Project
  Poem Assistant was made to help the user create poems. The tools it provides include: a poem prompt generator, 
  grammer checker, thesaurus, word generator, dictionary, and link to chatgpt, all easy to switch between with a single button click.

## Built With
  ![BadgeURLHere](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![BadgeURLHere](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![BadgeURLHere](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)

  <p align="right">(<a href="#readme-top">back to top</a>)</p>
  
## Installation

1. Fork this Repo
2. Clone the repo down to your machine
   ```sh
    git@github.com:{github-username}/poem-assistant-api.git 
   ```
3. `cd poem-assistant-api` to move into the project directory
4. Install dependencies
   ```sh
     npm install
   ```
5. Run your server
   ```sh
     node server.js
   ```
6. Be sure that both <a href="https://github.com/ross-ian28/poem-assistant-ui">front-end</a> and back-end servers are running at the same time

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Endpoints
```
http://localhost:8080
```
### Poem Prompt Generator
```
POST /prompt-generator

body: 
{
    "amount": "2"
}
headers: Content-Type = application/json
```
```
{
    "message": "1) Capture the beauty of a thunderstorm 2) Explore the concept of love through the lens of nature"
}
```
### Grammer Checker
```
POST /grammer-checker

body: 
{
    "message": "check my grammer can you"
}
headers: Content-Type = application/json
```
```
{
    "message": "Can you check my grammar for any errors and suggest improvements?"
}
```
### Thesaurus
```
POST /thesusus

body: 
{
    "word": "happy"
}
headers: Content-Type = application/json
```
```
{
    "message":
      "Synonyms for "happy": 1. Joyful 2. Delighted 3. Content 4. Elated 5. Pleased
      6. Ecstatic 7. Thrilled 8. Grateful 9. Satisfied 10. Cheerful
      Antonyms for "happy": 1. Sad 2. Unhappy 3. Miserable 4. Gloomy 5. Depressed
      6. Disappointed 7. Unfortunate 8. Despondent 9. Sorrowful 10. Distressed"
}
```
### Word Generator
```
POST /word-generator

body: 
{
    "amount": "3"
}
headers: Content-Type = application/json
```
```
{
    "message": "1) Serenade 2) Whispers 3) Velvet"
}
```
### Dictionary
```
POST /dictionary

body: 
{
    "word": "happy"
}
headers: Content-Type = application/json
```
```
{
    "message": "Happy is an adjective that describes a feeling of joy, pleasure, or contentment.
    It is a state of being characterized by positive emotions and a sense of well-being.
    People who are happy are generally cheerful, satisfied, and optimistic about life."
}
```
## Contact

Ian Ross - [@LinkedIn](https://github.com/ross-ian28) - ianross.codes@gmail.com
