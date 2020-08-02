import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ChatList } from "./Components/ChatList";
import { Login } from "./Components/Login";
import { Route, Switch, Router } from "react-router";
import { history } from "./history";
import AppProvider from "./AppContext";
import background from "./Assets/background.jpg";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div className="App" style={{ backgroundImage: background }}>
      <AppProvider>
        <Router history={history}>
          <NavBar />
          <SwitchRouter />
        </Router>
      </AppProvider>
    </div>
  );
}

export const SwitchRouter = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/chat" component={ChatList} />
    </Switch>
  );
};

export default App;
