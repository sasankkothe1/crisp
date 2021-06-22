const mongoose = require("mongoose");

// connecting to DB is an async function. As it has to be done without blocking the normal code execution thread.
// Async function is a promise based function and can be resolved either using ".then()" or "await" keyword
const connect = async (uri) => {
    try {
        console.log(uri);
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// we can declare many functions in the program and then can export them here
module.exports = {
    connect,
};
