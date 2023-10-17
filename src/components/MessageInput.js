import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const posterURL = process.env.REACT_APP_POSTER_URL;

const MessageInput = () => {
  const { userID } = useParams();
  const [formData, setFormData] = useState({
    user_id: "",
    text: "",
    url: "",
  });
  formData.user_id = userID;

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
          console.log("Response from server:", response.data);
          const { signed_url } = response.data;
          const headers = {
            "Content-Type": file.type,
          };

          await axios.put(signed_url, file, { headers: headers });
          console.log("File uploaded successfully.");
          formData.url = signed_url.split("?")[0];
          console.log("formData:", formData);
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
      if (formData.user_id || formData.text) {
        try {
          const headers = {
            "Content-Type": "application/json",
          };
          await axios.post(
            `${posterURL}/conversations/652924bdc5faf4a0ad9e9ab0/messages`,
            formData
          );
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
    <div className="inputs" style={{ display: "flex", alignItems: "center" }}>
      <TextField
        variant="outlined"
        name="user_id"
        value={formData.user_id}
        onChange={handleChange}
        placeholder="User ID"
        style={{ marginRight: "8px" }}
      />
      <TextField
        variant="outlined"
        name="text"
        value={formData.text}
        onChange={handleChange}
        placeholder="Message"
        style={{ flex: 1, marginRight: "8px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="primary" onClick={handleUploadClick}>
                <InsertPhotoIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div style={{ display: "none" }}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} />
      </div>
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default MessageInput;
