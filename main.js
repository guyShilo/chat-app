const app = require("express");
const router = app.Router();
const { users } = require("./users");
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

const constructHelloMessage = ({ senderName, room }) => {
  return {
    id: "Chat Bot",
    senderName: "Chat Bot",
    message: `Welcome ${senderName || "Guest"}!\n You are in room ${room}`,
    room: room,
  };
};

var messages = [];

router.get("/data", function (req, res, next) {
  let filteredMessages = messages.filter(
    (message) => message.room == req.query.room
  );

  const removeDuplicates = new Set([
    ...filteredMessages.map((message) => message.senderName),
  ]);
  const userNames = [...removeDuplicates];

  filteredMessages.map((message) =>
    userNames.reduce((prev, current) => {
      //   let newMessage;
      if (message.senderName === prev.senderName) {
        message.id = !message.id;
        if (message.id === 0) {
          return `${message.senderName} says ${message.message}`;
        }
      }
    })
  );
  //   const messagesByRoom = await messages.reduce((prev, current) => {
  //     if (!prev) {
  //       console.log("ibibib");
  //     } else if (prev.id === current.id) {
  //       console.log(current);
  //     }
  //   });

  //   console.log(messagesByRoom + "by room");
  const time = new Date().getTime();

  let seconds = Math.random() * 4000;
  if (seconds < 1000) {
    seconds = 1000;
  }
  if (seconds > 3500) {
    seconds = 3000;
  }
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
  messages.push(constructHelloMessage(req.query));
  res.json(true);
});

router.post("/data", (req, res) => {
  const { id, senderName, room, message } = req.query;

  messages.push({ id, senderName, room, message });
  console.log(req.query);
  res.json({ id, senderName, room, message });
});

// joinRoom
// username, room
// chat message

// when user connects

module.exports = router;
