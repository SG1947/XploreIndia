import { useState } from "react";
import { Navigate } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const url=import.meta.env.VITE_SERVER_URL;
export default function CreatePost() {
  const [value, setValue] = React.useState(0);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState(null);
  const [state, setState] = useState("");
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [travelType, setTravelType] = useState("solo");
  const [tripHighlight, setTripHighlight] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault(); // Move this to the top
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("file", files ? files[0] : null);
    data.set("state", state);
    data.set("destination", destination);
    data.set("fromDate", fromDate);
    data.set("toDate", toDate);
    data.set("travelType", travelType);
    data.set("tripHighlight", tripHighlight);
    data.set("rating",value);
  try {
    const response = await fetch(`${url}/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
    console.log(response);
    if (response.ok) {
      toast.success('New blog created!', {
        position: "top-center"
      
      });
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } else {
      
      const errorData = await response.json();
      console.log(errorData) ;// Parse the error response
      toast.warning("An error occurred", {
        position: 'top-center',
      });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    toast.error("Failed to create post: " + error.message, {
      position: 'top-center',
    });
    
  }
}
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <h3>Write Your Journey</h3>

      <label>
        Title
        <input
          type="text" 
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />
      </label>

      <div className="form-date">
        <label>
          State
          <input
            type="text" // Changed to text for state
            placeholder="West Bengal"
            value={state}
            onChange={(ev) => setState(ev.target.value)}
            required
          />
        </label>

        <label>
          Destination
          <input
            type="text" // Changed to text for destination
            placeholder="Jhargram"
            value={destination}
            onChange={(ev) => setDestination(ev.target.value)}
            required
          />
        </label>
      </div>

      <label>
        Brief Summary
        <input
          type="text" // Changed to text for summary
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          required
        />
      </label>

      <label>
        Image
        <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      </label>

      <div className="form-date">
        <label>
          From:
          <input
            type="date"
            value={fromDate.split('T')[0]}
            onChange={(ev) => setFromDate(ev.target.value.split('T')[0])}
            required
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate.split('T')[0]}
            min={fromDate.split('T')[0]}
            onChange={(ev) => setToDate(ev.target.value.split('T')[0])}
            required
          />
        </label>

        <label>
          Travel Type:
          <select
            value={travelType}
            onChange={(ev) => setTravelType(ev.target.value)}
            required
          >
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="business">Business</option>
          </select>
        </label>
      </div>

      <label>
        Trip Highlight
        <textarea
          value={tripHighlight}
          onChange={(ev) => setTripHighlight(ev.target.value)}
        />
      </label>
      <Box sx={{ '& > legend': { mt: 2 } }}>
      <Typography component="legend">Rate your experience </Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
      <button style={{ marginTop: "5px" }}>Create Post</button>
      <ToastContainer/>
    </form>
  );
}
