import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const url=import.meta.env.VITE_SERVER_URL;
export default function EditPage() {
  const {id} = useParams();
  const [rating, setRating] = React.useState(0);
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

  useEffect(() => {
    fetch(`${url}/post/`+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setSummary(postInfo.summary);
          setState(postInfo.state);
          setDestination(postInfo.destination);
          setFromDate(postInfo.fromDate)
          setToDate(postInfo.toDate);
          setTripHighlight(postInfo.tripHighlight);
          setRating(postInfo.rating)
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("state", state);
    data.set("destination", destination);
    data.set("fromDate", fromDate);
    data.set("toDate", toDate);
    data.set("travelType", travelType);
    data.set("tripHighlight", tripHighlight);
    data.set("rating",rating);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch(`${url}/post`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      toast.success('Edit success!', {
        position: "top-center"
      
      });
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
    else{
      toast.error("An error occured");
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
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
            type="text" 
            placeholder="West Bengal"
            value={state}
            onChange={(ev) => setState(ev.target.value)}
            required
          />
        </label>

        <label>
          Destination
          <input
            type="text"
            placeholder="Kolkata"
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
        value={rating}
        onChange={(ev) => setRating(ev.target.value)}
      />
    </Box>
      
      <button style={{marginTop:'5px'}}>Update post</button>
      <ToastContainer/>
    </form>
  );
}