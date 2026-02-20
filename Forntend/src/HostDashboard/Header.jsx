// components/Header/Header.jsx
import React from 'react';
import { Box, Typography, Button, Avatar, Container } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useAuth } from '../PropertyDetails/AuthContext';
export default function Header({ User }) {
  console.log(User)
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const { user, loading, setUser, checkAuth } = useAuth();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const settings = () => {
    navigate("/settings")
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const mainPage = () => {
    navigate("/")
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
    <Box className="header">
      <Container maxWidth="xl">
        <Box className="header-content">
          <Box className="header-left">
            <Typography variant="h4" className="header-title">
              Welcome back, {User?.host?.name}
            </Typography>
            <Typography variant="body1" className="header-subtitle">
              Let's manage your listings and reservations.
            </Typography>
          </Box>

          <Box className="header-right">
            <a href="/addListing" onClick={(e) => {
              e.preventDefault();
              navigate("/addListing");
            }} className='addlisting'>
              <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i>
              Add Listing
            </a>

            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
              className="switch-mode-btn"
            >
              Switch Mode
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small">
                  <Avatar
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    className="user-avatar"
                  />
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
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  {user?.name || 'Profile'}
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}