const moment = require("moment");
const app = require("express");
const router = app.Router();
const users = require("./users");
/*
&&&&& Not in use


*/
const rooms = [];
const messages = [];

router.post("messages/submitMessage", async (req, res) => {
  res.json("messages");
});

module.exports = router;
