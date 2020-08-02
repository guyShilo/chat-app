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

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  let helloMessage = [
    {
      id: "Chat Bot",
      senderName: "Chat Bot",
      message: `Welcome ${context.currentUser || "Guest"}!\n You are inroom ${
        context.currentRoom
      }`,
      room: context.currentRoom,
    },
  ];

  let message;
  const filteredTry = messages.filter((msg) =>
    msg.senderName === context.currentUser ? (msg.id = 0) : (msg.id = 1)
  );
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

  const postData = async ({ id, senderName, room, message }) => {
    //   id, senderName, room, message
    const request = axios.post(
      `${context.url}data?id=${id}&message=${message}&senderName=${senderName}&room=${room}`
    );
    const response = await request;
    // setMessages([...messages, ...response.data]);
    await getDataCallBack();
  };

  const getDataCallBack = useCallback(async () => {
    console.log("fetching");
    return await axios(
      `${context.url}data?room=${context.currentRoom}&senderName=${context.currentUser}`
    )
      .then((res) => {
        if (!res.data.hasValue) {
          setMessages([...messages]);
        } else {
          setLoading(true);
          return res.data;
        }
      })
      .catch((err) => err);
  }, [context.currentRoom, loading, postData]);

  useEffect(() => {
    getDataCallBack().then(async (data) => {
      if (!data) {
        setLoading(!loading);
        return;
      } else {
        if (data.value.length) {
          console.log(filteredTry);
          setMessages(data.value);
        }
      }
      return await delay(7000).then(() => setLoading(!loading));
    });
  }, [context.currentRoom, loading, filteredTry]);

  return context.userLoggedIn ? (
    <div className="container">
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
          messages={helloMessage.concat(
            messages.filter((msg) =>
              msg.room === context.currentRoom ? msg : helloMessage
            )
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
          <code>{`${loading ? "loading..." : context.currentUser}`}</code>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "2rem",
            }}
          ></div>
        </Card>
      </Paper>
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
