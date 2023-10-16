import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import "./App.css";

function UserPage() {
  const { userID } = useParams();

  return (
    <div>
      <MessageInput userID={userID} />
      <MessageList userID={userID} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/:userID" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
