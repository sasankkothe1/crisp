require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/error');

// Connect DB
connectDB();

// adding express to our app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use Routes
app.use('/api', routes.api);

// Error Handler (Should be last piece of middleware)
app.use(errorHandler)

// when server is running, get request with url '/' will return "Hello world. <-- for testing purposes"
app.get('/', (req, res) => res.send("Hello World"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));