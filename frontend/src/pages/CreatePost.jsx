import { useState } from "react";
import { Navigate } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
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
  //   const response = await fetch(`${url}/post`, {
  //     method: "POST",
  //     body: data,
  //     credentials: "include",
  //   });
  //   console.log(response);
  //   if (response.ok) {
  //     setRedirect(true);
  //   }
  //   else {
  //     // If the response is not ok, handle the error
  //     const errorData = await response.json(); // Parse the error response
  //     alert(`Error ${response.status}: ${errorData.message || 'An error occurred'}`); // Display error message
  //   }
  // }
  try {
    // Send a POST request to create a new post
    const response = await fetch(`${url}/post`, {
      method: "POST",
      body: data,
      credentials: "include",
      // Remove Content-Type header, as it will be set automatically for FormData
    });
    console.log(response);
    if (response.ok) {
      // If the request was successful, redirect the user
      setRedirect(true);
    } else {
      // If the response is not ok, handle the error
      const errorData = await response.json(); // Parse the error response
      alert(`Error ${response.status}: ${errorData.message || 'An error occurred'}`); // Display error message
    }
  } catch (error) {
    // Handle any network errors or unexpected errors
    console.error("Error creating post:", error);
    alert("Failed to create post: " + error.message);
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
          type="text" // Corrected type
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
            value={fromDate}
            onChange={(ev) => setFromDate(ev.target.value)}
            required
          />
        </label>

        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(ev) => setToDate(ev.target.value)}
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
            <option value="couple">Couple</option>
            <option value="business">Business</option>
          </select>
        </label>
      </div>

      <label>
        Trip Highlight
        <textarea
          value={tripHighlight}
          onChange={(ev) => setTripHighlight(ev.target.value)}
          required
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
    </form>
  );
}
