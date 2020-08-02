import React, { useContext, useState } from "react";

export const ChatAppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    senderName: localStorage.getItem("user"),
    room: localStorage.getItem("room"),
    id: localStorage.getItem("id"),
  });
  const [currentInChat, setCurrentInChat] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [countries, setCountires] = React.useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const url = "/";
  const handleRoomChange = (event) => {
    console.log(event.target.value);
    setCurrentCountry(Number(event.target.value) || "");
  };

  const handleAutoComplete = async () => {
    let obj = {};
    const countries = [];
    // "https://gist.githubusercontent.com/keeguon/2310008/raw/865a58f59b9db2157413e7d3d949914dbf5a237d/countries.json"

    await fetch("https://api.github.com/gists/2310008/comments/869598")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        const eachCountry = JSON.parse("[" + data.body.split("[")[1]);
        eachCountry.map((country) => countries.push(country));
        // names.push(eachCountry.name);
      });
    setCountires(countries);
  };

  React.useEffect(() => {
    handleAutoComplete();
  }, []);

  return (
    <ChatAppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRoom,
        setCurrentRoom,
        setUserLoggedIn,
        userLoggedIn,
        currentCountry,
        setCurrentCountry,
        countries,
        setCountires,
        handleRoomChange,
        currentMessages,
        setCurrentMessages,
        currentInChat,
        setCurrentInChat,
        url,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};

export default AppProvider;
