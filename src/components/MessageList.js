import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router-dom";
const receiverURL = process.env.REACT_APP_RECEIVER_URL;
const posterURL = process.env.REACT_APP_POSTER_URL;
const wsURL = process.env.REACT_APP_WS_URL;
const READ_DURATION = 60 + 8;

const MessageListWrapper = () => {
  const { userID } = useParams();
  return <MessageList userID={userID} />;
};

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const userID = this.props.userID;
    const fetchData = async () => {
      try {
        const response = await fetch(`${receiverURL}/server/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const currentTime = new Date(utc + (3600000 * '+0'));
        console.log(currentTime);

        console.log("CURRENT TIME:", currentTime);
        const filteredData = data.filter((message) => {
          const messageTime = new Date(message.timestamp);
          const timeDifferenceInSeconds = (currentTime - messageTime) / 1000;

          console.log("Message:", message.text);
          console.log("Current time:", currentTime);
          console.log("Message time:", messageTime);
          console.log("Time difference:", timeDifferenceInSeconds);
          if (message.read_by.includes(userID)) {
            return timeDifferenceInSeconds <= READ_DURATION;
          } else {
            return !message.read_by.includes(userID);
          }
        });

        this.setState({ messages: filteredData });
        console.log(filteredData);

        for (const message of filteredData) {
          this.markAsRead(message.conversation_id, message._id);
        }
      } catch (error) {
        console.error("Error fetching or parsing messages:", error);
      }
    };

    fetchData();

    this.socket = io(
      "wss://app-7b3a3c98-565a-4b75-9e80-683f4e59b229.cleverapps.io"
    );

    this.socket.on("connect", () => {
      console.log("Connected to socket server.");
    });

    this.socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      const data = JSON.parse(message);
      console.log("New message received:", data);
      this.setState((prevState) => ({
        messages: [...prevState.messages, data],
      }));
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server.");
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  componentDidUpdate() {
    const element = document.querySelector(".conversation-h");
    element.scrollTop = element.scrollHeight;
  }
  markAsRead = async (conversationId, messageId) => {
    console.log("Marking message as read...");
    console.log(conversationId);
    console.log(messageId);
    try {
      await axios.put(
        `${posterURL}/conversations/${conversationId}/messages/${messageId}/read`,
        {"user_id": this.props.userID},
      );
    } catch (error) {
      console.error("Error marking the message as read:", error);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  };

  render() {
    return (
      <div>
        <h1 className="conversation">Message History</h1>
        <ul className="conversation-h">
          {this.state.messages.map((message, index) => {
            return (
              <li className="message-container" key={index}>
                <p className="msg-time">
                  {message.timestamp.split("T")[0].slice(5, 10)} :{" "}
                  {message.timestamp.split("T")[1].slice(0, 5)}
                </p>
                <div className="msg-sender">
                  Sent by : <p>{message.sender}</p>
                </div>
                <div className="msg-text">
                  Saying : <p>{message.text}</p>
                </div>
                <img src={message.image} default="img" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default MessageListWrapper;
