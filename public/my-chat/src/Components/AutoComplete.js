import React, { Component, Fragment, useState, useContext } from "react";
import PropTypes from "prop-types";
import { ChatAppContext } from "../AppContext";
import { Input, ListItem, List } from "@material-ui/core";
import { inputStyle } from "./styles";

const Autocomplete = ({ suggestions, handleClose }) => {
  const context = useContext(ChatAppContext);

  const [autoCompleteState, setAutoCompleteState] = useState({
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: "",
  });
  const {
    activeSuggestion,
    filteredSuggestions,
    showSuggestions,
    userInput,
  } = autoCompleteState;
  // Event fired when the input value is changed
  const onChange = (e) => {
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    setAutoCompleteState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  // Event fired when the user clicks on a suggestion
  const onClick = (e) => {
    // context.handleRoomChange(e);
    alert(`you have chosen ${e.currentTarget.innerText}`); // Update the user input and reset the rest of the state
    context.setCurrentRoom(e.currentTarget.innerText);
    setAutoCompleteState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
    if (handleClose) handleClose();
  };

  // Event fired when the user presses a key down
  const onKeyDown = (e) => {
    // User pressed the enter key, update the input and close the window
    if (e.keyCode === 13) {
      context.setCurrentRoom(filteredSuggestions[activeSuggestion].name);
      // context.handleRoomChange(e);
      setAutoCompleteState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[0][activeSuggestion.name],
      });
      if (handleClose) handleClose();
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      setAutoCompleteState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      setAutoCompleteState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  let suggestionsListComponent;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <List className="suggestions text-center">
          {filteredSuggestions.map((suggestion, index) => {
            return (
              <ListItem
                className={className}
                key={suggestion.name}
                onClick={onClick}
              >
                {suggestion.name}
                <img
                  src={`https://www.countryflags.io/${suggestion.code}/flat/16.png`}
                  alt={suggestion.code}
                  className="m-1"
                />
              </ListItem>
            );
          })}
        </List>
      );
    } else {
      suggestionsListComponent = (
        <div className="no-suggestions">
          {console.log(autoCompleteState)}
          <em>No suggestions, you're on your own!</em>
        </div>
      );
    }
  }

  return (
    <div className="d-flex flex-column">
      <code>Enter a room by searching your country! 🌍</code>
      <br />
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        style={inputStyle}
        placeholder="in our chat, you choose a room by your country"
      />
      {suggestionsListComponent}
    </div>
  );
};

export default Autocomplete;
