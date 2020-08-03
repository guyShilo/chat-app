const path = require("path");
const express = require("express");
const mainRoute = require("./main");
const messagesRoute = require("./messages");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());

app.use("/", mainRoute);
app.use("/", messagesRoute);

app.use(express.static(path.join(__dirname, "public/my-chat/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "public/my-chat/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT || 5000, () => console.log(`server is running on ${PORT}`));
