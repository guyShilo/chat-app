const path = require("path");
const express = require("express");
const mainRoute = require("./main");
const messagesRoute = require("./messages");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
// Handles any requests that don't match the ones above

// run when clients connect
// socket

app.use("/", mainRoute);
app.use("/", messagesRoute);
app.use(express.static(path.join(__dirname, "public/my-chat/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "public/my-chat/build/index.html"));
});

// const PORT = 5000 || process.env.PORT;
app.listen(process.env.PORT || 5000, () =>
  console.log(`server is running on ${PORT}`)
);
