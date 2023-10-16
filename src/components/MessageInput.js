import React, { useState, useRef } from "react";
import axios from "axios";

const posterURL = process.env.REACT_APP_POSTER_URL;

const MessageInput = () => {
  const [formData, setFormData] = useState({
    idConversation: "",
    text: "",
    image: null,
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

  const handleSend = async () => {
    try {
      let isFileUploaded = false;
      let isFormSubmitted = false;

      if (file) {
        try {
          const response = await axios.get(`${posterURL}/upload-url`, {
            params: { content_type: file.type },
          });

          const { signed_url } = response.data;
          const headers = {
            "Content-Type": file.type,
          };

          await axios.put(signed_url, file, { headers: headers });
          console.log("File uploaded successfully.");
          isFileUploaded = true;
          setFile(null);
        } catch (error) {
          console.log("Error while uploading the file: ", error);
          if (error.response) {
            console.log("Server Response:", error.response.data);
          }
          return;
        }
      }
      if (formData.idConversation || formData.text) {
        const form_data = new FormData();
        for (let key in formData) {
          form_data.append(key, formData[key]);
        }
        console.log("form_data: ", form_data)
        try {
          await axios.post(`${posterURL}/convsersations/${formData.idConversation}/messages`, form_data);  
        } catch (error) {
          console.log("Error while submitting the form: ", error);
          return;
        }
        
        isFormSubmitted = true;
      }

      if (isFileUploaded && isFormSubmitted) {
        console.log("Both file and form submitted successfully.");
      } else if (isFileUploaded) {
        console.log("File uploaded successfully.");
      } else if (isFormSubmitted) {
        console.log("Form submitted successfully.");
      } else {
        console.log("Nothing to send.");
      }
    } catch (error) {
      console.log("Error in handleSend function:", error);
    }
  };

  return (
    <div className="inputs">
      <input
        type="text"
        name="idConversation"
        defaultValue={formData.idConversation}
        onChange={handleChange}
        placeholder="Conversation ID"
      />
      <input
        type="text"
        name="text"
        defaultValue={formData.text}
        onChange={handleChange}
        placeholder="Message"
      />
      <div>{file ? `Selected File: ${file.name}` : "No file selected."}</div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button onClick={handleUploadClick}>Select Image</button>
      <button className="send" onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
