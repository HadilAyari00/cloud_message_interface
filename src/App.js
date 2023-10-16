import React from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <MessageInput />
      <MessageList />
    </div>
  );
}

export default App;
