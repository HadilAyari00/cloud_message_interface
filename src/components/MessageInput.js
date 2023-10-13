import React, { useState } from "react";
import axios from "axios";

const posterURL = process.env.REACT_APP_POSTER_URL;

const MessageInput = () => {
  const [formData, setFormData] = useState({
    idSender: "",
    idReceiver: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Sending request to:", `${posterURL}/form`);
      console.log("With data:", formData);

      const form_data = new FormData();
      for (let key in formData) {
        form_data.append(key, formData[key]);
      }

      const response = await axios.post(`${posterURL}/form`, form_data);
      console.log("Response:", response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="idSender"
        value={formData.idSender}
        onChange={handleChange}
        placeholder="Sender ID"
      />
      <input
        type="text"
        name="idReceiver"
        value={formData.idReceiver}
        onChange={handleChange}
        placeholder="Receiver ID"
      />
      <input
        type="text"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default MessageInput;
