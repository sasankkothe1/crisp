require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/error");

const DatabaseController = require("./controllers/db");

// Connect DB
DatabaseController.connect(process.env.MONGODB_URI);

// adding express to our app
const app = express();

// enable CORS for a all routes
app.use(cors());

// use uploads in public folder
// in this way, we can refer to an image with a link like http://localhost:4000/<filename> or http://localhost:4000/<filename>
app.use(express.static("./public/uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use Routes
app.use("/api", routes.api);

// Error Handler (Should be last piece of middleware)
app.use(errorHandler);

// when server is running, get request with url '/' will return "Hello world. <-- for testing purposes"
app.get("/", (req, res) => res.send("Hello World"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
