import {Link} from "react-router-dom";
import * as React from 'react';
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserContext.jsx";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
const url=process.env.REACT_APP_server;
export default function Header({ setSearchTerm }) {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch(`${url}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo({
          ...userInfo,
          isAuthenticated: true
        });
        console.log("profile",userInfo);
      });
    });
  }, []);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function logout() {
    fetch(`${url}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
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
      <Link to="/" className="logo">XploreIndia</Link>
      <div className="search">
        <input type="text" placeholder="&nbsp;Enter destination to search......"  onChange={handleSearchChange}/>
        <button>Search</button>
      </div>
      {username && (
      <div>
      <Button className="menu"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
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
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className="menu" onClick={handleClose}>
          <>
            <Link to="/create">Create new post</Link>
            
          </>
          </MenuItem>
        <MenuItem onClick={handleClose}><a onClick={logout}>Logout ({username})</a></MenuItem>
      </Menu>
    </div>)}

    {!username && (
      <div>
      <Button className="menu"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
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
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className="menu" onClick={handleClose}>
          <>
            <Link to="/login">Login</Link>
            
          </></MenuItem>
        <MenuItem onClick={handleClose}><Link to="/register">Register</Link></MenuItem>
      </Menu>
    </div>)}

      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
