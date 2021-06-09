const connectDB = require('./config/db');

// importing express module
const express = require('express');

const routes = require('./routes');

// adding express to our app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

// when server is running, get request with url '/' will return "Hello world. <-- for testing purposes"
app.get('/', (req, res) => res.send("Hello World"));

// use Routes
app.use('/api', routes.api);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));