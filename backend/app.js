// importing express module
const express = require('express');

const db = require('./model');

// adding express to our app
const app = express();

// when server is running, get request with url '/' will return "Hello world. <-- for testing purposes"
app.get('/', (req, res) => res.send("Hello World"));

// setting a port to run the server. Usually it is 4000. But can be set to any port
const port = 4000;

// listen() function will be triggered when the server is started
// will be running on http://localhost:4000/
app.listen(port, () => console.log(`Server is running on port ${port}`));