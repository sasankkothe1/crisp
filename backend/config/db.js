// importing mongoose, config and mongoURI from the config
// NOTE: config is a npm module that identifies the different config files (.json file)
// for further information please refer to https://www.npmjs.com/package/config
const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

// connecting to DB is an async function. As it has to be done without blocking the normal code execution thread.
// Async function is a promise based function and can be resolved either using ".then()" or "await" keyword
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("Connected to DB");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// we can declare many functions in the program and then can export them here
module.exports = connectDB;