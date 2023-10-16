import React, { useEffect, useState } from "react";

const receiverURL = process.env.REACT_APP_RECEIVER_URL;
const wsURL = receiverURL.replace(/^http/, "ws");
import io from "socket.io-client";

const MessageList = () => {
  const socket = io(wsURL+":8080");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("receiverURL: ", receiverURL)
      console.log("wsURL: ", wsURL);
      try {
        const response = await fetch(`${receiverURL}/server/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching or parsing messages:", error);
      }
    };

    fetchData();

    socket.on("connect", () => {
      console.log("Connected to socket server.");
    });

    socket.on("newMessage", (message) => {
      setMessages((prevState) => [...prevState, message]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server.");
    });

    return () => {
      socket.off("message");
    }
  }, []);

  return (
    <div>
      <h1 className="conversation">Message History</h1>
      <ul className="conversation-h">
        {messages.map((message, index) => {
          return (
          <li className="message-container" key={index}>
            <p className="msg-time">{message.timestamp.split('T')[0].slice(5, 10)} : {message.timestamp.split('T')[1].slice(0, 5)}</p>
            <div className="msg-sender">Sent by : <p>{message.sender}</p></div>
            <div className="msg-text">Saying : <p>{message.text}</p></div>
            <img src={message.image} default="img"/>
            </li>)
        })}

      </ul>
    </div>
  );
};

export default MessageList;
