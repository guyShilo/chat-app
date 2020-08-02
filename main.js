const app = require("express");
const router = app.Router();
const { users } = require("./users");
const messages = [];
const rooms = [];
const formatMessage = (id, senderName, message, room) => {
  return {
    id,
    senderName,
    message,
    time: moment().format("h:mm a"),
    room: room,
  };
};

router.get("/data", function (req, res, next) {
  let filteredMessages = messages.filter(
    (message) => (message.room = req.query.room)
  );

  const removeDuplicates = new Set([
    ...filteredMessages.map((message) => message.senderName),
  ]);
  const userNames = [...removeDuplicates];

  filteredMessages.map((message) =>
    userNames.map((user, index) => {
      //   let newMessage;
      if (message.senderName === user) {
        message.id = index;
      }
    })
  );

  const time = new Date().getTime();

  let seconds = Math.random() * 2000;
  if (seconds < 1000) {
    seconds = 1000;
  }
  if (seconds > 2500) {
    seconds = 2000;
  }
  console.log(filteredMessages);
  console.log("waiting seconds before responding", seconds);

  return setTimeout(function () {
    return res.json({
      hasValue: filteredMessages.length ? true : false,
      value: filteredMessages,
    });
  }, seconds);
  //   return setTimeout(function () {
  //     return res.json({ hasValue: true, value: time });
  //   }, seconds);
});

router.post("/data/joinRoom", async (req, res) => {
  const messagesForRoom = messages.filter(
    (message) => message.room == req.query.room
  );
  res.json(messagesForRoom);
});

router.post("/data", (req, res) => {
  const { id, senderName, room, message } = req.query;

  messages.push({ id, senderName, room, message });

  res.json({ id, senderName, room, message });
});

// joinRoom
// username, room
// chat message

// when user connects

module.exports = router;
