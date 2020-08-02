import React from "react";
import { ChatBubble, Message } from "react-chat-ui";
import { Typography, Grid } from "@material-ui/core";

export const MyBubble = ({ message }) => {
  const newMessage = new Message(message);
  return (
    <Grid container>
      {/* <Typography
        style={{ marginLeft: "3rem", padding: "0.5rem" }}
        as="p"
      >{`${message.senderName}:`}</Typography> */}
      <ChatBubble message={newMessage} />
    </Grid>
  );
};
