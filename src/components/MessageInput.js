import React, { useState } from "react";
import axios from "axios";

const posterURL = process.env.REACT_APP_POSTER_URL;

const MessageInput = () => {
  const [formData, setFormData] = useState({
    idSender: "",
    idReceiver: "",
    message: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log("handleFileChange triggered");
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    console.log("handleFileUpload triggered");
    if (file) {
      console.log("Attempting to upload file:", file);
      try {
        const response = await axios.get(`${posterURL}/upload-url`, {
          params: { "content-type": file.type },
        });
        console.log("Signed URL:", response.data);
        const { signed_url } = response.data;

        const uploadResponse = await axios.put(signed_url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        console.log("Upload Response:", uploadResponse);
        console.log("File uploaded successfully.");
      } catch (error) {
        console.log("File upload failed:", error);
      }
    } else {
      console.log("No file selected for upload.");
    }
  };

  const handleSubmit = async () => {
    try {
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
      <input
        type="file"
        onChange={handleFileChange}
        onClick={() => console.log("File input clicked")}
      />
      <button onClick={handleFileUpload}>Upload Image</button>
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default MessageInput;
