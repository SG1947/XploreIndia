import { useEffect, useState, useContext } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext.jsx";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material"; // Assuming you're using MUI for styling
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  // const [likes, setLikes] = useState(0); // State to track likes

  useEffect(() => {
    fetch(`http://localhost:8000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        return response.json();
      })
      .then((postInfo) => {
        console.log(postInfo.likes.likedBy);
        setPostInfo(postInfo);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (redirect) {
    return <Navigate to="/" />; // Redirect to the homepage after deletion
  }

  if (!postInfo) return ""; // Handle loading state or return an empty string

  async function deletePost() {
    const response = await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true); // Set redirect to true if the deletion is successful
    } else {
      const errorMessage = await response.json();
      console.error("Failed to delete post:", errorMessage);
    }
  }

  async function handleLike() {
    const response = await fetch(`http://localhost:8000/post/${id}/like`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPostInfo(updatedPost); // Update post info to reflect new like count
    } else {
      const errorMessage = await response.json();
      console.error("Failed to like post:", errorMessage);
    }
  }
  const tripHighlights = postInfo.tripHighlight
    ? postInfo.tripHighlight
        .split(/\n|\. /)
        .filter((item) => item.trim() !== "")
    : [];
  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="postchange">
          <Link to={`/edit/${postInfo._id}`}>
            <button>Edit this post</button>
          </Link>
          <button onClick={deletePost}>Delete Post</button>
        </div>
      )}
      <div className="image">
        <img src={`${postInfo.cover.path}`} alt="" />
      </div>
      <div className="author">Summary</div>

      <div className="details">{postInfo.summary}</div>
      <Box className="details">
        <Typography component="legend"><strong>Rating</strong></Typography>
        <Rating name="read-only" value={postInfo.rating} readOnly />
      </Box>
      <p className="details">
        <strong>State:</strong> {postInfo.state}
      </p>
      <p className="details">
        <strong>Destination:</strong> {postInfo.destination}
      </p>
      <p className="details">
        <strong>From:</strong>{" "}
        {new Date(postInfo.fromDate).toLocaleDateString()}
      </p>
      <p className="details">
        <strong>To:</strong> {new Date(postInfo.toDate).toLocaleDateString()}
      </p>
      <p className="details">
        <strong>Travel Type:</strong> {postInfo.travelType}
      </p>
      <p className="details">
        <strong>Trip Highlight:</strong>
        <ul>
          {tripHighlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </p>

      {userInfo.id !== postInfo.author._id && (
        
          <div onClick={handleLike} className="like-section" >
            {postInfo.likes?.likedBy?.includes(userInfo.id) ? (
              <>
                <FavoriteIcon style={{ color: "red" }} />
                <span style={{color:"black"}}>You have already liked this!</span>
              </>
            ) : (
              <>
                <FavoriteBorderOutlinedIcon />&nbsp;&nbsp;&nbsp;
                <span style={{color:"black"}}>Please like this post</span>
              </>
            )}
          </div>
      )}
    </div>
  );
}