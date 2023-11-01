import React, { useEffect, useState } from "react";
import axios from "axios";
const posterURL = process.env.REACT_APP_POSTER_URL;

const ConversationsList = ({
  userID,
  setSelectedConversation,
  selectedConversation,
}) => {
  const [conversations, setConversations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [participantIDs, setParticipantIDs] = useState("");

  useEffect(() => {
    axios
      .get(`${posterURL}/users/${userID}`)
      .then((response) => {
        setConversations(response.data.conversations);
        console.log("convos ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }, [userID]);

  const createConversation = () => {
    const participantsArray = participantIDs
      .split(",")
      .map((id) => ({ user_id: id.trim() }));
    participantsArray.push({ user_id: userID });

    axios
      .post(`${posterURL}/conversations`, {
        name: "New Conversation",
        participants: participantsArray,
        read_duration: 60,
      })
      .then((response) => {
        setConversations([...conversations, response.data.id]);
        setShowForm(false);
        setParticipantIDs("");
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  const handleSelectConversation = (conversationID) => {
    setSelectedConversation(conversationID);
    // Here you can also set any state you need for the selected conversation,
    // or make API calls to get the conversation details.
  };

  return (
    <div>
      <h2>Conversations</h2>
      {showForm && (
        <div>
          <input
            type="text"
            placeholder="Enter user IDs, comma separated"
            value={participantIDs}
            onChange={(e) => setParticipantIDs(e.target.value)}
          />
          <button onClick={createConversation}>Create</button>
        </div>
      )}
      <button
        style={{
          background: "lightblue",
          padding: "10px",
          borderRadius: "5px",
          margin: "10px 0",
        }}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "New Conversation"}
      </button>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Array.isArray(conversations)
          ? conversations.map((conversationID, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedConversation === conversationID
                      ? "lightgrey"
                      : "white",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
                onClick={() => handleSelectConversation(conversationID)}
              >
                {/* Placeholder for chat icon */}
                <div
                  style={{
                    marginRight: "10px",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "lightgray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  🗨️
                </div>
                {conversationID}
              </li>
            ))
          : "Loading or no conversations available."}
      </ul>
    </div>
  );
};

export default ConversationsList;
