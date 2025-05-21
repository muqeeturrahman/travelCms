import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  useTheme,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  FlightTakeoff,
  Hotel,
  People,
  EventNote,
  Settings,
  ChevronLeft,
  Menu as MenuIcon,
  LocalOffer,
  Logout,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3008/api';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Booked Flights', icon: <FlightTakeoff />, path: '/booked-flights' },
  { text: 'Hotels', icon: <Hotel />, path: '/hotels' },
  { text: 'Customers', icon: <People />, path: '/customers' },
  { text: 'Bookings', icon: <EventNote />, path: '/bookings' },
  { text: 'Discounts', icon: <LocalOffer />, path: '/discounts' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const drawerWidth = 240;

export default function Sidebar({ open, onToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();

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
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 64,
          backgroundColor: '#1e293b', // Dark blue background
          color: '#94a3b8', // Slate-400 for default text
          overflowX: 'hidden',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          borderRight: '1px solid #334155', // Slate-700 border
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'space-between' : 'center',
        padding: theme.spacing(2),
        minHeight: 64,
        borderBottom: '1px solid #334155', // Slate-700 border
        backgroundColor: '#0f172a', // Darker blue for header
      }}>
        {open ? (
          <>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                color: '#f8fafc', // Slate-50
                fontWeight: 600,
                fontSize: '1.25rem',
              }}
            >
              Go Trip CMS
            </Typography>
            <IconButton 
              onClick={onToggle}
              sx={{ 
                color: '#94a3b8', // Slate-400
                '&:hover': {
                  color: '#f8fafc', // Slate-50
                  backgroundColor: 'rgba(148, 163, 184, 0.1)', // Slate-400 with opacity
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton 
            onClick={onToggle}
            sx={{ 
              color: '#94a3b8', // Slate-400
              '&:hover': {
                color: '#f8fafc', // Slate-50
                backgroundColor: 'rgba(148, 163, 184, 0.1)', // Slate-400 with opacity
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ borderColor: '#334155' }} /> {/* Slate-700 */}

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          
          return (
            <Tooltip
              key={item.text}
              title={!open ? item.text : ""}
              placement="right"
            >
              <ListItem
                button
                component={Link}
                to={item.path}
                selected={isSelected}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mx: 1,
                  my: 0.5,
                  borderRadius: '8px',
                  color: '#f8fafc', // White text by default
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: '#334155', // Slate-700
                    color: '#f8fafc', // Slate-50
                    '&:hover': {
                      backgroundColor: '#475569', // Slate-600
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#f8fafc', // Slate-50
                    }
                  },
                  '&:hover': {
                    backgroundColor: '#1f2937', // Slate-800
                    color: '#38bdf8', // Light blue on hover
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: '#38bdf8', // Light blue on hover
                    }
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: isSelected ? '#f8fafc' : '#f8fafc', // White for both states
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text}
                    sx={{ 
                      opacity: 1,
                      '& .MuiListItemText-primary': {
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.875rem',
                        color: '#f8fafc', // White text
                      }
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: '#334155' }} /> {/* Slate-700 */}

      <List>
        <Tooltip
          title={!open ? "Logout" : ""}
          placement="right"
        >
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              mx: 1,
              my: 0.5,
              borderRadius: '8px',
              color: '#ef4444', // Red color for logout
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red with opacity
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: '#ef4444', // Red on hover
                }
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: '#ef4444', // Red color
                transition: 'color 0.2s ease-in-out',
              }}
            >
              <Logout />
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary="Logout"
                sx={{ 
                  opacity: 1,
                  '& .MuiListItemText-primary': {
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    color: '#ef4444', // Red color
                  }
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
} 