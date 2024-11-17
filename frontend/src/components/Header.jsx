import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext.jsx";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
const url = import.meta.env.VITE_SERVER_URL;
export default function Header({ setSearchTerm }) {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${url}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo({
          ...userInfo,
          isAuthenticated: true,
        });
        console.log("profile", userInfo);
      });
    });
  }, []);
  const scrollToPosts = () => {
    const postsSection = document.querySelector(".main-content");
    console.log(postsSection);
    if (postsSection) {
      postsSection.scrollIntoView();
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    scrollToPosts();
  };

  function logout() {
    fetch(`${url}/logout`, {
      credentials: "include",
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          // Clear user info from state
          setUserInfo({
            id: null,
            username: null,
            isAuthenticated: false,
          });
          navigate("/");
        } else {
          console.error("Failed to logout");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        XploreIndia
      </Link>
      <div className="search-container">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="Enter destination to search..."
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {username ? (
        <div>
          <Button
            className="menu"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Menu
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem className="menu" onClick={handleClose}>
              <>
                <Link to="/create">Create new blog</Link>
              </>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <a onClick={logout}>Logout ({username})</a>
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          <Button
            className="menu"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Menu
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem className="menu" onClick={handleClose}>
              <>
                <Link to="/login">Login</Link>
              </>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link to="/register">Register</Link>
            </MenuItem>
          </Menu>
        </div>
      )}

      <nav>
        {username ? (
          <>
            <Link to="/create">Create new blog</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
