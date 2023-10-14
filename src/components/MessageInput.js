import React, { useState, useRef } from "react";
import axios from "axios";

const posterURL = process.env.REACT_APP_POSTER_URL;

const MessageInput = () => {
  const [formData, setFormData] = useState({
    idSender: "",
    idReceiver: "",
    message: "",
  });

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    console.log("handleChange triggered");
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log("handleFileChange triggered");
    setFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    console.log("handleUploadClick triggered");
    fileInputRef.current.click();
  };

  const handleSend = async () => {
    console.log("handleSend triggered");

    if (file) {
      console.log(
        `Attempting to upload file: ${file.name}, content-type: ${file.type}`
      );
      try {
        const response = await axios.get(`${posterURL}/upload-url`, {
          params: { "content-type": file.type },
        });

        const { signed_url } = response.data;

        await axios.put(signed_url, file, {
          headers: { "Content-Type": file.type },
        });

        console.log("File uploaded successfully.");
      } catch (error) {
        console.log("File upload failed:", error);
        console.log("Stopping further execution.");
        return;
      }
    }

    try {
      const form_data = new FormData();
      for (let key in formData) {
        form_data.append(key, formData[key]);
      }

      const response = await axios.post(`${posterURL}/form`, form_data);
      console.log("Form submit Response:", response.data);
    } catch (error) {
      console.log("Form submit failed:", error);
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button onClick={handleUploadClick}>Select Image</button>
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
