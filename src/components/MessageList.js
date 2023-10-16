import React, { useEffect, useState } from "react";

const receiverURL = process.env.REACT_APP_RECEIVER_URL;
const wsURL = receiverURL.replace(/^http/, "ws");

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

    const ws = new WebSocket(wsURL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        console.log("Message received from WebSocket: ", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error(`WebSocket Error: ${error}`);
    };

    return () => {
      ws.close();
    };
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
