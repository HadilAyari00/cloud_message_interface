import React, { useEffect, useState } from "react";

const receiverURL = process.env.REACT_APP_RECEIVER_URL;

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from:", `${receiverURL}/server/history`);
        const response = await fetch(`${receiverURL}/server/history`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Message History</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
