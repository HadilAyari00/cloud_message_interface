import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const receiverURL = process.env.REACT_APP_RECEIVER_URL;
const wsURL = process.env.REACT_APP_WS_URL;

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    console.log(wsURL)
    this.socket = io("wss://app-7b3a3c98-565a-4b75-9e80-683f4e59b229.cleverapps.io");


    this.socket.on("connect", () => {
      console.log("Connected to socket server.");
    });

    this.socket.on("newMessage", (message) => {
      
      const data = JSON.parse(message)
      console.log("New message received:", data);
      this.setState((prevState) => ({
        messages: [...prevState.messages, data],
      }));
    });

    //scroll to bottom after new message is received
    this.scrollToBottom = () => {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server.");
    });
  }

  componentDidMount() {
    const fetchData = async () => {
      try {
        const response = await fetch(`${receiverURL}/server/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        this.setState({messages: data});
      } catch (error) {
        console.error("Error fetching or parsing messages:", error);
      }
    };

    fetchData();
  }

  render() {
    return (
      <div>
        <h1 className="conversation">Message History</h1>
        <ul className="conversation-h">
          {this.state.messages.map((message, index) => {
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
  }
}

export default MessageList;
