// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

const cors = require('cors');

app.use(express.json());

app.use(cors());

// Sample data
const friendData = [
{
	"avatar":"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
	"name":"hatim fanzaoui",
	"status":"ofline",
	"email": "hatim@hatim.hatim",
	"rate": 100,
},
  {
    "avatar": "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    "name": "Robert Wolfkisser",
    "status": "online",
    "email": "rob_wolf@gmail.com",
    "rate": 22
  },
  {
    "avatar": "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
    "name": "Jill Jailbreaker",
    "status": "offline",
    "email": "jj@breaker.com",
    "rate": 45
  },
  {
    "avatar": "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
    "name": "Henry Silkeater",
    "status": "online",
    "email": "henry@silkeater.io",
    "rate": 76
  },
  {
    "avatar": "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
    "name": "Bill Horsefighter",
    "status": "offline",
    "email": "bhorsefighter@gmail.com",
    "rate": 15
  },
  {
    "avatar": "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    "name": "Jeremy Footviewer",
    "status": "online",
    "email": "jeremy@foot.dev",
    "rate": 98
  }
]

const userData = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    name: 'Robert Wolfkisser',
    level: 'level 2',
    state: "online",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    name: 'Jill Jailbreaker',
    level: 'level 6',
    state: "ofline",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Henry Silkeater',
    level: 'level 2',
    state: "on game",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Bill Horsefighter',
    level: 'level 5',
    state: "ofline",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Jeremy Footviewer',
    level: 'level 3',
    state: "on game",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    name: 'Robert Wolfkisser',
    level: 'level 2',
    state: "online",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    name: 'Jill Jailbreaker',
    level: 'level 6',
    state: "ofline",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Henry Silkeater',
    level: 'level 2',
    state: "on game",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Bill Horsefighter',
    level: 'level 5',
    state: "ofline",
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Jeremy Footviewer',
    level: 'level 3',
    state: "on game",
  },
];


const useravatar = {avatar:"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png"};

// Middleware to parse JSON data
app.use(bodyParser.json());

app.get("/user/avatar", (req, res) => {
	res.json(useravatar);	
});

const username = {name: "Playr 404"};

app.get("/user/name", (req, res) => {
	res.json(username);
});

// Endpoint to handle profile info
app.post('/user/name', (req, res) => {
const  uniqueName = req.body;

console.log(uniqueName);
//console.log("avatar: ", avatar);
  // Your logic to handle the data goes here

  // For demonstration purposes, just send a response
  res.json({ message: 'UniqueName received successfully' });
});

app.post('/user/avatr', (req, res) => {
	const avatar = req.body;
	console.log(avatar);
	res.json({message: "Avatar was uploded successfully"});

});

const towFacto = {towfactor: false};
app.get('/2f/state', (req, res) => {
	res.json(towFactor);
});

// Endpoint to send data to the client
app.get('/login', (req, res) => {
	//res.redirect("https://google.com");
  res.json(friendData);
});

app.get('/friend/list', (req, res) => {
	res.json(friendData);
});

app.get('/user/list', (req, res) => {
	res.json(userData);
});

app.get('/verify', (req, res) => {
	res.json({number: "200"});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

