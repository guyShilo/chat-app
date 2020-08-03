import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fade, Grid, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { ChatAppContext } from "../AppContext";
import { useHistory } from "react-router";
import Autocomplete from "./AutoComplete";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const context = React.useContext(ChatAppContext);
  const history = useHistory();
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Button
              size="large"
              className="text-light"
              onClick={() => setShowAutoComplete(!showAutoComplete)}
            >
              Switch Room
            </Button>
            {showAutoComplete ? (
              <Fade in={showAutoComplete}>
                <Grid container item justify="center" className="p-2 ">
                  <Paper className="p-4 m-2">
                    <Autocomplete
                      suggestions={context.countries}
                      setState={context.setCurrentCountry}
                    />
                  </Paper>
                </Grid>
              </Fade>
            ) : null}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {`Welcome ${
              typeof context.currentUser !== "object"
                ? context.currentUser
                : "Guest"
            }! ${
              context.currentRoom
                ? `You are currently in room ${context.currentRoom}`
                : "You are not logged in."
            } `}
          </Typography>
          <Button onClick={() => history.push("/login")} color="inherit">
            {`${context.userLoggedIn ? "Logged IN" : "Login"}`}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
