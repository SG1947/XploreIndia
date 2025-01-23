import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_SERVER_URL;

export default function EditAccountPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favouriteDestination, setFavouriteDestination] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data when the component mounts
    fetch(`${url}/account`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setFavouriteDestination(data.favouriteDestination);
        setSocialLinks(data.socialLinks);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, []);

  async function updateAccount(ev) {
    ev.preventDefault();
    const response = await fetch(`${url}/account/edit`, {
      method: "PUT",
      body: JSON.stringify({
        username,
        email,
        password,
        favouriteDestination,
        socialLinks,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 200) {
      toast.success("Profile updated successfully!", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/account"); // Navigate back to Account page
      }, 2000);
    } else {
      toast.error("Update failed. Please try again later.", {
        position: "top-center",
      });
    }
  }

  return (
    <form className="edit-account" onSubmit={updateAccount}>
      <h1>Edit Account</h1>
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <label>Favourite Destination</label>
      <input
        type="text"
        value={favouriteDestination}
        onChange={(ev) => setFavouriteDestination(ev.target.value)}
      />
      <div>
        <label htmlFor="facebook">Facebook URL</label>
        <input
          type="url"
          id="facebook"
          value={socialLinks.facebook}
          onChange={(ev) =>
            setSocialLinks({ ...socialLinks, facebook: ev.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="instagram">Instagram URL</label>
        <input
          type="url"
          id="instagram"
          value={socialLinks.instagram}
          onChange={(ev) =>
            setSocialLinks({ ...socialLinks, instagram: ev.target.value })
          }
        />
      </div>
      <button type="submit">Save Changes</button>
      <ToastContainer />
    </form>
  );
}
