import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

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
        const utc = d.getTime() + d.getTimezoneOffset() * 60000;
        const currentTime = new Date(utc + 3600000 * "+0");
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


    this.socket = io("wss://app-7b3a3c98-565a-4b75-9e80-683f4e59b229.cleverapps.io");

    //const conversation_ids = [str(1), str(2), str(3), str(4), str(5)];
    //need to change this to the conversation ids of the user !
    
    this.socket.on("connect", () => {
      console.log("Connected to socket server.");
      //this.socket.emit("joinConversations", { conversation_ids: conversation_ids });
    });

    this.socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      const data = JSON.parse(message);
      console.log("New message received:", data);
      this.markAsRead(data.conversation_id, data._id);
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
        { user_id: this.props.userID }
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
        <ul
          className="conversation-h"
          style={{ listStyleType: "none", padding: 0 }}
        >
          {this.state.messages.map((message, index) => {
            return (
              <div key={index}>
                <div style={{ fontWeight: "bold", margin: "10px 0" }}>
                  {message.sender}
                </div>
                <li
                  className="message-container"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "15px",
                    margin: "5px 0",
                    padding: "10px",
                  }}
                >
                  <div
                    className="msg-text"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderRadius: "10px",
                      padding: "5px",
                    }}
                  >
                    {message.text}
                  </div>
                  <p
                    className="msg-time"
                    style={{
                      color: "gray",
                      textAlign: "right",
                      margin: "5px 0",
                    }}
                  >
                    {message.timestamp.split("T")[0].slice(5, 10)} :{" "}
                    {message.timestamp.split("T")[1].slice(0, 5)}
                  </p>
                </li>
                {message.image && (
                  <li
                    className="message-image-container"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "15px",
                      margin: "5px 0",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={message.image}
                      alt="message"
                      style={{ borderRadius: "10px", maxWidth: "200px" }}
                    />
                    <p
                      className="msg-time"
                      style={{
                        color: "gray",
                        textAlign: "right",
                        margin: "5px 0",
                      }}
                    >
                      {message.timestamp.split("T")[0].slice(5, 10)} :{" "}
                      {message.timestamp.split("T")[1].slice(0, 5)}
                    </p>
                  </li>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
  render() {
    return (
      <div>
        <h1 className="conversation">Message History</h1>
        <ul
          className="conversation-h"
          style={{ listStyleType: "none", padding: 0 }}
        >
          {this.state.messages.map((message, index) => {
            return (
              <li
                className="message-container"
                key={index}
                style={{
                  margin: "10px 0",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  marginLeft: "25px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {message.sender}
                </div>
                {message.text && (
                  <div
                    className="msg-text"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderRadius: "15px",
                      padding: "10px",
                      display: "inline-block",
                      maxWidth: "70%",
                    }}
                  >
                    {message.text}
                  </div>
                )}
                {message.image && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={message.image}
                      alt="message"
                      style={{
                        borderRadius: "15px",
                        maxWidth: "200px",
                        display: "inline-block",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{ color: "gray", fontSize: "12px", marginLeft: "5px" }}
                >
                  {message.timestamp.split("T")[0].slice(5, 10)} :{" "}
                  {message.timestamp.split("T")[1].slice(0, 5)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default MessageListWrapper;
