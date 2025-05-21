import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3008/api';

export default function Header({ open }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`${API_BASE_URL}/user/logout`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'authToken': token
        }
      });

      // Clear all auth data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAuthenticated');

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should still clear local data and redirect
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '64px',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2563eb"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            GoTrip
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            borderLeft: '1px solid #e2e8f0',
            pl: 3,
          }}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#0f172a',
                fontWeight: 600,
              }}
            >
              Admin User
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                display: 'block',
              }}
            >
              Administrator
            </Typography>
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              p: 0,
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: '#0f172a',
                width: 40, 
                height: 40,
              }}
            >
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  fontSize: '0.875rem',
                },
              },
            }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <Logout sx={{ mr: 1.5, fontSize: '1.25rem' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 