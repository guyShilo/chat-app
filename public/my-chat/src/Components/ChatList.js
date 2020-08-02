import React, { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import {
  ChatFeed,
  Message,
  ChatBubbleProps,
  ChatBubble,
  BubbleGroup,
} from "react-chat-ui";
import { MyBubble } from "./MyBubble";

import {
  Grid,
  Button,
  Paper,
  Typography,
  Fade,
  Card,
  Input,
} from "@material-ui/core";

import { ChatAppContext } from "../AppContext";
import { useHistory } from "react-router";
import Autocomplete from "./AutoComplete";
import { inputStyle } from "./styles";

const styles = {
  button: {
    backgroundColor: "#fff",
    borderColor: "#1D2129",
    borderStyle: "solid",
    borderRadius: 20,
    borderWidth: 2,
    color: "#1D2129",
    fontSize: 18,
    fontWeight: "300",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  selected: {
    color: "#fff",
    backgroundColor: "#0084FF",
    borderColor: "#0084FF",
  },
};

const users = {
  0: "You",
  1: "Mark",
  2: "Evan",
};

const customBubble = (props) => (
  <div>
    <p>{`${props.message.senderName} ${props.message.id ? "says" : "said"}: ${
      props.message.message
    }`}</p>
  </div>
);

export const ChatList = () => {
  const context = useContext(ChatAppContext);
  const currentUsers = context.currentUsers;
  const history = useHistory();
  //   const [messages, setMessages] = useState({
  //     messages: [],
  //     useCustomBubble: false,
  //     currentUsers,
  //   });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  let helloMessage = [
    {
      id: 1,
      senderName: "Chat Bot",
      message: `Welcome to room ${context.currentRoom} ${
        context.currentUser || "Guest"
      }`,
      room: context.currentRoom,
    },
  ];
  //   const onPress = (user) => {
  //     setMessages({ ...messages, curr_user: user });
  //   };
  let message;

  const onMessageSubmit = (e) => {
    const input = message;
    e.preventDefault();
    if (!input.value) {
      return false;
    }
    pushMessage(0 || 1, input.value);
    input.value = "";
    return true;
  };

  const pushMessage = async (recipient, message) => {
    const newMessage = {
      id: recipient,
      message,
      senderName: context.currentUser,
      room: context.currentRoom,
    };
    setMessages([...messages, newMessage]);
    await postData(newMessage);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //   const getData = async (retries = 0) => {
  //     console.log(context.currentUsers);
  //     return await axios(`http://localhost:5000/data?room=${context.currentRoom}`)
  //       .then((res) => {
  //         console.log(res.data);
  //         if (res.data.hasValue === true) {
  //           setMessages(helloMessage.concat(res.data.value));
  //           setLoading(false);
  //         } else {
  //           console.log("not setting value");
  //         }
  //         // if (res.data.hasValue) {
  //         //   return Promise.resolve(res.data); // success!
  //         // } else if (retries >= 15) {
  //         //   return Promise.reject(res); // failure
  //         // }
  //       })
  //       .catch((err) => err);
  //   };

  const postData = async ({ id, senderName, room, message }) => {
    //   id, senderName, room, message
    setLoading(true);
    const request = axios.post(
      `/data?id=${id}&message=${message}&senderName=${senderName}&room=${room}`
    );
    const response = await request;
    // setMessages([...messages, {message: response.data}]);
    await getDataCallBack();
  };

  const getDataCallBack = useCallback(async () => {
    console.log("fetching");
    return await axios(
      `/data?room=${context.currentRoom}&senderName=${context.currentUser}`
    )
      .then((res) => {
        if (!res.data.hasValue) {
          setMessages([...helloMessage, ...messages]);
          //   setLoading(true)

          console.log(res.data.hasValue);
        } else {
          //   setMessages(helloMessage.concat(res.data.value));
          return res.data;
        }
      })
      .catch((err) => err);
  }, [loading, postData]);

  //   getDataCallBack, loading
  useEffect(() => {
    getDataCallBack().then((data) => {
      console.log(data);
      if (!data) {
        console.log("no data");
      } else {
        if (data.value.length !== 0) {
          console.log("data is pop" + data.value);
          helloMessage = {
            ...helloMessage[0],
            id: helloMessage.id === 1 ? 0 : 1,
          };
          console.log(helloMessage);
          setMessages([helloMessage, ...data.value]);
          setLoading(true);
        }
      }
    });
    return () => delay(25000).then(() => setLoading(false));
  }, [loading]);

  return context.userLoggedIn ? (
    <div className="container">
      {/* <Typography variant="h3" className="mt-2 p-1 text-center text-light">
        Welcome to my Chat App
      </Typography> */}

      {/* {loading ? console.log() : ( */}
      {console.log(messages, context.currentMessages, context)}

      <Paper
        className="chatfeed-wrapper shadow-lg"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "2rem 0.5rem",
          padding: "1rem",
        }}
      >
        <ChatFeed
          chatBubble={messages.useCustomBubble && customBubble}
          maxHeight={250}
          messages={messages.filter(
            (message) => message.room === context.currentRoom
          )} // Boolean: list of message objects
          showSenderName
        />
        <Card>
          <form onSubmit={(e) => onMessageSubmit(e)}>
            <input
              ref={(m) => {
                message = m;
              }}
              placeholder="Go ahead! Start typing =)"
              className="mt-4 p-1"
              style={inputStyle}
            />
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "2rem",
            }}
          >
            {/* <button
         style={{
           ...styles.button,
           ...(currentUsers.includes(context.currentUser) === 2
             ? styles.selected
             : {}),
         }}
         onClick={() => onPress(2)}
       >
         Evan
       </button> */}
          </div>
        </Card>
      </Paper>
      {/* )} */}
      {/* <h2 className="text-center">And we have Bubble Groups!</h2>
   <BubbleGroup
     messages={[
       new Message({ id: 1, message: "Hey!" }),
       new Message({ id: 1, message: "I forgot to mention..." }),
       new Message({
         id: 1,
         message:
           "Oh no, I forgot... I think I was going to say I'm a BubbleGroup",
       }),
     ]}
     id={1}
     showSenderName={true}
     senderName={"Elon Musk"}
   />
   <ChatBubble
     message={new Message({ id: 2, message: "I 'm a single ChatBubble!" })}
   />
   <BubbleGroup
     messages={[
       new Message({ id: 0, message: "How could you forget already?!" }),
       new Message({
         id: 0,
         message: "Oh well. I'm a BubbleGroup as well",
       }),
     ]}
     id={1}
     showSenderName={true}
     senderName={"Elon Musk"}
   /> */}
    </div>
  ) : (
    <div>
      <Grid
        container
        item
        direction="column"
        alignContent="center"
        justify="center"
        style={{ height: "100vh" }}
      >
        <Typography>Seems you are not logged in.</Typography>
        <Button onClick={() => history.push("login")}>Click to Log In</Button>
      </Grid>
    </div>
  );
};

// export const ChatList = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       room: 1,
//       message: "message",
//     },
//     {
//       id: 2,
//       room: 1,
//       message: "message2",
//     },
//     {
//       id: 3,
//       room: 2,
//       senderName: "user",
//       message: "message3",
//     },
//   ]);
//   const [room, setRoom] = useState(0);

//   const onMessageSubmit = (e) => {
//     const input = message;
//     e.preventDefault();
//     if (!input.value) {
//       return false;
//     }
//     this.pushMessage(messages.curr_user, input.value);
//     input.value = "";
//     return true;
//   };

//   return
// };

// (
//     <Grid container justify={"center"}>
//       <Button onClick={() => setRoom(1)}>Enter Room 1</Button>
//       <Button onClick={() => setRoom(2)}>Enter Room 2</Button>
//       <Grid container item xs={12} xl={3} direction="column">
//         {messages.map((message) => (
//           <MyBubble message={message} />
//         ))}
//       </Grid>
//     </Grid>
//   );
