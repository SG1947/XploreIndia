import { useEffect, useState, useContext } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext.jsx";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material"; // Assuming you're using MUI for styling
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_SERVER_URL;
export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  // const [likes, setLikes] = useState(0); // State to track likes

  useEffect(() => {
    fetch(`${url}/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        return response.json();
      })
      .then((postInfo) => {
        // console.log(postInfo.likes.likedBy);
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
    const response = await fetch(`${url}/post/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success("Edit success!", {
        position: "top-center",
      });
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
    } else {
      const errorMessage = await response.json();
      toast.error("Failed to delete", {
        position: "top-center",
      });
      console.error("Failed to delete post:", errorMessage);
    }
  }

  async function handleLike() {
    const response = await fetch(`${url}/post/${id}/like`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      toast.success("Thanks for liking!", {
        position: "top-center",
      });
      const updatedPost = await response.json();
      setPostInfo(updatedPost);
    } else {
      const errorMessage = await response.json();
      toast.error("Please login to like the post!", {
        position: "top-center",
      });
      console.error("Please login to like the post:", errorMessage);
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
        <Typography component="legend">
          <strong>Rating</strong>
        </Typography>
        <Rating name="read-only" value={postInfo.rating} readOnly />
      </Box>
      <p className="details">
        <strong>State:</strong> {postInfo.state}
      </p>
      <p className="details">
        <strong>Destination:</strong> {postInfo.destination}
      </p>
      <p className="details">
        <strong>From:</strong> {postInfo.fromDate.split("T")[0]}
      </p>
      <p className="details">
        <strong>To:</strong> {postInfo.toDate.split("T")[0]}
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
        <IconButton onClick={handleLike} className="like-section">
          {postInfo.likes?.likedBy?.includes(userInfo.id) ? (
            <>
              <FavoriteIcon style={{ color: "red" }} />
              <span style={{ color: "black" }}>
                You have already liked this!
              </span>
            </>
          ) : (
            <>
              <FavoriteBorderOutlinedIcon />
              &nbsp;&nbsp;&nbsp;
              <span style={{ color: "black" }}>Please like this post</span>
            </>
          )}
        </IconButton>
      )}
      
      <ToastContainer />
    </div>
  );
}
