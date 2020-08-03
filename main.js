const app = require("express");
const router = app.Router();
const { users } = require("./users");
// const rooms = [];

// const formatMessage = (id, senderName, message, room) => {
//   return {
//     id,
//     senderName,
//     message,
//     time: moment().format("h:mm a"),
//     room: room,
//   };
// };

const constructHelloMessage = ({ senderName, room }) => {
  return {
    id: "Chat Bot",
    senderName: "Chat Bot",
    message: `Welcome ${senderName || "Guest"}!\n You are in room ${room}`,
    room: room,
  };
};

var messages = [];

router.post("/data", (req, res) => {
  const { id, senderName, room, message } = req.query;
  // adds a message to the array
  messages.push({ id, senderName, room, message });
  res.json({ id, senderName, room, message });
});

router.get("/data", function (req, res, next) {
  // filter messages by room
  let filteredMessages = messages.filter(
    (message) => message.room == req.query.room
  );

  // get all user names and remove duplicates
  const removeDuplicates = new Set([
    ...filteredMessages.map((message) => message.senderName),
  ]);
  const userNames = [...removeDuplicates];

  // handles the id, to be used in client side. i need two id's for the chat, 0 and 1
  filteredMessages.map((message) =>
    userNames.reduce((prev, current) => {
      if (message.senderName === prev.senderName) {
        message.id = !message.id;
        // if (message.id === 0) {
        //   return `${message.senderName} says ${message.message}`;
        // }
      }
    })
  );
  // handles the delay of the request to prevent overload.
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
      // if the array is empty, return false
      hasValue: filteredMessages.length ? true : false,
      value: filteredMessages,
    });
  }, seconds);
});

router.post("/data/joinRoom", async (req, res) => {
  messages.push(constructHelloMessage(req.query));
  res.json(true);
});

// joinRoom
// username, room
// chat message

// when user connects

module.exports = router;
