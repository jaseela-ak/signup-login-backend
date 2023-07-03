const express = require("express");
require('./config/db');
const app = express();
PORT = 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const userRoute = require("./routes/User");

// app.use(express.json());
app.use("/api/users/", userRoute);

app.listen(PORT, (req, res) => {
    console.log(`server running on ${PORT}`);
  });