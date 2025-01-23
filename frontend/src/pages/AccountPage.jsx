import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { UserContext } from "../components/UserContext";
import Post from "../components/Post.jsx";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import default styles
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
const url = import.meta.env.VITE_SERVER_URL;

export default function AccountPage() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myBlogs"); // Default tab
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${url}/account`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${url}/post`)
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
      });
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteAccount = () => {
    confirmAlert({
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete your account? This action cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            fetch(`${url}/account/delete`, {
              method: "DELETE",
              credentials: "include",
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to delete account.");
                }
                toast.success("Account deleted successfully.", {
                  autoClose: 3000,
                });
                setUserInfo(null); // Assuming setUserInfo clears the context
                navigate("/");
              })
              .catch((error) => {
                console.error("Error deleting account:", error);
                toast.error(
                  "An error occurred while trying to delete your account.",
                  { autoClose: 3000 }
                );
              });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="account-page">
      <h1 className="profile-title">User Profile</h1>
      {userData ? (
        <div className="profile-card">
          <p className="profile-item">
            <strong>Username:</strong> {userData.username}
          </p>
          <p className="profile-item">
            <strong>Email ID:</strong> {userData.email}
          </p>
          <p className="profile-item">
            <strong>Favourite Destination:</strong>{" "}
            {userData.favouriteDestination}
          </p>
          <div className="social-links">
            <h3>Social Links:</h3>
            {userData.socialLinks ? (
              <ul className="social-list">
                {userData.socialLinks.instagram && (
                  <li>
                    <strong>Instagram:</strong>{" "}
                    <a
                      href={userData.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {userData.socialLinks.instagram}
                    </a>
                  </li>
                )}
                {userData.socialLinks.facebook && (
                  <li>
                    <strong>Facebook:</strong>{" "}
                    <a
                      href={userData.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {userData.socialLinks.facebook}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="no-social-links">No social links available</p>
            )}
          </div>
          <div className="profile-card-actions">
            <Button
              variant="contained"
              color="primary"
              className="edit-button"
              onClick={() => navigate("/account/edit")}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="delete-button"
              onClick={handleDeleteAccount}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}

      <div className="tabs">
        <Button
          onClick={() => handleTabChange("myBlogs")}
          variant="contained"
          color={activeTab === "myBlogs" ? "primary" : "default"}
        >
          My Blogs
        </Button>
        <Button
          onClick={() => handleTabChange("likedBlogs")}
          variant="contained"
          color={activeTab === "likedBlogs" ? "primary" : "default"}
        >
          Liked Blogs
        </Button>
      </div>

      <div className="tab-content">
        {activeTab === "myBlogs" && (
          <div className="my-blogs-section">
            <h2>My Blogs</h2>
            <ul>
              {posts
                .filter((post) => userInfo.id === post.author._id)
                .map((post) => (
                  <Post key={post._id} {...post} />
                ))}
            </ul>
            <>
              <Link to="/create" className="create-blog-button">
                <span className="plus-icon">+</span> Create New Blog
              </Link>
            </>
          </div>
        )}
        {activeTab === "likedBlogs" && (
          <div className="liked-blogs-section">
            <h2>Liked Blogs</h2>
            <ul>
              {posts
                .filter((post) => post.likes.likedBy.includes(userInfo.id))
                .map((post) => (
                  <Post key={post._id} {...post} />
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
