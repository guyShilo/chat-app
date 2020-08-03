import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import { useHistory } from "react-router";
import { ChatAppContext } from "../AppContext";
import Autocomplete from "./AutoComplete";
import login from "../Assets/login.svg";
import { inputStyle } from "./styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export const Login = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [user, setUser] = React.useState("");

  const context = useContext(ChatAppContext);
  const history = useHistory();

  const handleUserChange = (event) => {
    console.log(event.target.value);
    setUser(event.target.value || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    const generateID = parseInt(Math.random() * 100);
    console.log(context.url);
    const request = axios.post(
      `${context.url}data/joinRoom?id=${generateID}&senderName=${user}&room=${context.currentRoom}`
    );

    const response = await request;

    if (response.data && response.status === 200) {
      context.setCurrentUser(user);
      //   localStorage.setItem("user", response.data.senderName);
      //   localStorage.setItem("room", response.data.room);
      //   localStorage.setItem("id", response.data.id);
      //   localStorage.setItem("loggedIn", "true");
      context.setCurrentMessages(response.data);
      context.setCurrentInChat([...context.currentInChat, response.data]);
      //   context.setCurrentRoom(room);
      context.setUserLoggedIn(true);
      setOpen(false);
      return history.push("/chat");
    }
  };

  return (
    <div>
      <img className="w-25 m-3 p-3" src={login} alt="login" />
      <Typography variant="h3" className="text-light">
        Welcome.
      </Typography>
      <Typography variant="h4" className="text-light">
        Press the button 👇🏻 down below to Log In.
      </Typography>
      <Button size="large" className="text-light" onClick={handleClickOpen}>
        Log In to the chat.
      </Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Enter the chat</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <input
                style={inputStyle}
                placeholder={"Enter your chat alias"}
                value={user}
                onChange={handleUserChange}
              ></input>
            </FormControl>

            <FormControl className={classes.formControl}>
              <Autocomplete
                handleClose={handleClose}
                handleRoomChange={context.handleRoomChange}
                setState={context.setCurrentCountry}
                suggestions={context.countries}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
