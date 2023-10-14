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
    try {
      if (file) {
        console.log("Attempting to upload file:", file);
        const {
          data: { signed_url },
        } = await axios.get(`${posterURL}/upload-url`, {
          params: { "content-type": file.type },
        });
        console.log("Signed URL:", signed_url);

        const uploadResponse = await axios.put(signed_url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        console.log("Upload Response:", uploadResponse.data);
      }

      const form_data = new FormData();
      for (const key in formData) {
        form_data.append(key, formData[key]);
      }

      const response = await axios.post(`${posterURL}/form`, form_data);
      console.log("Form submit Response:", response.data);
    } catch (error) {
      console.log("An error occurred:", error);
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
