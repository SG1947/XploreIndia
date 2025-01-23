import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../components/UserContext.jsx";

const url = import.meta.env.VITE_SERVER_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();

    // Input validation
    if (!username.trim()) {
      toast.error("Username cannot be empty!", {
        position: "top-center",
      });
      return;
    }

    if (!password.trim()) {
      toast.error("Password cannot be empty!", {
        position: "top-center",
      });
      return;
    }

    try {
      const response = await fetch(`${url}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo({
          ...userInfo,
          isAuthenticated: true,
        });
        toast.success("Welcome to XploreIndia!", {
          position: "top-center",
        });
        setTimeout(() => {
          setRedirect(true);
        }, 2000);
      } else if (response.status === 401) {
        toast.error("Incorrect username or password!", {
          position: "top-center",
        });
      } else {
        toast.error("An error occurred during login. Please try again later.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please check your connection and try again.", {
        position: "top-center",
      });
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
      <ToastContainer />
      First time user? <span><Link to={"/register"}>Register</Link></span>
    </form>
  );
}
