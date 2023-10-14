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
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const axiosWithRetry = async (url, config, retries = 3, timeout = 1000) => {
    try {
      return await axios(url, config);
    } catch (error) {
      if (retries === 0) {
        throw new Error("Max retries reached");
      }
      await new Promise((resolve) => setTimeout(resolve, timeout));
      return await axiosWithRetry(url, config, retries - 1, timeout);
    }
  };

  const handleSend = async () => {
    try {
      console.log("handleSend triggered");

      if (file) {
        try {
          const response = await axios.get(`${posterURL}/upload-url`, {
            params: { content_type: file.type },
          });

          const { signed_url } = response.data;
          console.log("response.data ", response.data);
          console.log("signed url ", signed_url);
          const headers = {
            "Content-Type": file.type,
          };

          await axios.put(signed_url, file, { headers: headers });
          console.log("File uploaded successfully.");
        } catch (error) {
          console.log("Error while uploading the file: ", error);
          if (error.response) {
            console.log("Server Response:", error.response.data);
          }
          return;
        }
      }

      const form_data = new FormData();
      for (let key in formData) {
        form_data.append(key, formData[key]);
      }

      await axios.post(`${posterURL}/form`, form_data);
      console.log("Form submit successful.");
    } catch (error) {
      console.log("Error in handleSend function:", error);
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
