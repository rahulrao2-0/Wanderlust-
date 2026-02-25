import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Radio, RadioGroup, FormControlLabel, FormLabel, } from "@mui/material";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import "./Navbar.css"
import { useState } from 'react';
import Login from '../Autherization/Login.jsx';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../PropertyDetails/AuthContext.jsx';



export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const { user, loading, setUser, checkAuth } = useAuth();


  // Menu handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const mainPage = () => {
    navigate("/")
  }
  const settings = () => {
    navigate("/settings")
  }

  const addAccount = () => {
    navigate("/signup");
  }
  const handleMyProfile = () => {
    navigate("/host/dashboard")
  }
  const logout = async () => {
    try {
      const result = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (result.ok) {
        setUser(null); // reset frontend user state
        navigate("/");  // redirect to homepage
      } else {
        alert("Logout failed. Please try again.");
      }

    } catch (err) {
      console.error("Logout error:", err);
      alert("Network error. Please try again.");
    }
  }



  return (
    <div className='Navbar'>
      <h2><i className="fa-regular fa-compass"></i>WanderLust</h2>

      <div className='tagDiv'>
        {user ? (<>
          <a href="/host" onClick={(e) => {
            e.preventDefault();
            navigate("/host");
          }}>Become a Host</a>
        </>) : (<></>)}
        {!user ? (<>
          <a href="/signup" onClick={(e) => {
            e.preventDefault();
            navigate("/signup");
          }}>
            Signup
          </a>
          <a href="/login" onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}>
            Login
          </a>
        </>) : (<>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleClick} size="small">
                <Avatar sx={{ width: 32, height: 32 }}></Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              PaperProps={{
                sx: {
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderRadius: '12px',
                  mt: 1,
                  minWidth: '220px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  '& .MuiMenuItem-root': {
                    padding: '12px 16px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.95rem',
                    '&:hover': {
                      backgroundColor: 'rgba(231, 76, 60, 0.08)',
                      color: '#e74c3c',
                      transform: 'translateX(4px)',
                      paddingLeft: '20px'
                    },
                    '&:active': {
                      backgroundColor: 'rgba(231, 76, 60, 0.12)'
                    }
                  },
                  '& .MuiDivider-root': {
                    margin: '8px 0',
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }
              }}
            >
              <MenuItem onClick={mainPage} sx={{ fontWeight: 600, color: '#2c3e50' }}>
                <Avatar sx={{
                  mr: 1.5,
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  fontSize: '0.85rem',
                  color: 'white'
                }}>
                  {user?.user?.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                {user?.user?.name || 'Profile'}
              </MenuItem>
              {user?.host ? (
                <>
                  <MenuItem onClick={handleMyProfile} sx={{ fontWeight: 500 }}>
                    <Avatar sx={{
                      mr: 1.5,
                      width: 32,
                      height: 32,
                      background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                      fontSize: '0.85rem',
                      color: 'white'
                    }}>
                      H
                    </Avatar>
                    My Profile
                  </MenuItem></>) : (<></>)}

              <Divider />

              <MenuItem onClick={addAccount} sx={{ fontWeight: 500 }}>
                <ListItemIcon sx={{ color: '#3498db', minWidth: '32px' }}>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add account
              </MenuItem>

              <MenuItem onClick={settings} sx={{ fontWeight: 500 }}>
                <ListItemIcon sx={{ color: '#f39c12', minWidth: '32px' }}>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>

              <MenuItem onClick={logout} sx={{ fontWeight: 500 }}>
                <ListItemIcon sx={{ color: '#e74c3c', minWidth: '32px' }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>

        </>)}

      </div>

    </div>
  );
}
