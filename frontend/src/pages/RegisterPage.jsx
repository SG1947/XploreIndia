import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const url = import.meta.env.VITE_SERVER_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favouriteDestination, setFavouriteDestination] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
  });
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();

    // Input validation
    if (!username.trim()) {
      toast.error("Username cannot be empty!", { position: "top-center" });
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address!", { position: "top-center" });
      return;
    }
    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters long!", { position: "top-center" });
      return;
    }
    if (!favouriteDestination.trim()) {
      toast.error("Favourite destination cannot be empty!", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          favouriteDestination,
          socialLinks,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Registration successful! Please log in.", { position: "top-center" });
        setTimeout(() => {
          setRedirect(true);
        }, 3000);
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          toast.error(errorData.message, { position: "top-center" });
        } else {
          toast.error("Registration failed. Please try again.", { position: "top-center" });
        }
      }
    } catch (error) {
      console.error("Network error during registration:", error);
      toast.error("Network error. Please try again later.", { position: "top-center" });
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <label>Username</label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <label>Email</label>
      <input
        type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <label>Favourite Destination</label>
      <input
        type="text"
        placeholder="Your favourite destination"
        value={favouriteDestination}
        onChange={(ev) => setFavouriteDestination(ev.target.value)}
      />
      <div>
        <label htmlFor="facebook">Facebook URL</label>
        <input
          type="url"
          id="facebook"
          placeholder="https://www.facebook.com/..."
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
          placeholder="https://www.instagram.com/..."
          value={socialLinks.instagram}
          onChange={(ev) =>
            setSocialLinks({ ...socialLinks, instagram: ev.target.value })
          }
        />
      </div>
      <button>Register</button>
      <ToastContainer />
      Already registered?{" "}
      <span>
        <Link to={"/login"}>Login</Link>
      </span>
    </form>
  );
}

