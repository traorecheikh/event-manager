import React, { useState } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  Tooltip
} from '@mui/material';

// Import icons
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  AddCircle as AddIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

// Import global styles
import './styles/GlobalStyles.css';

function App() {
  const { isAuthenticated, logout, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  // Loading state with animation
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="fade-in"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
        <Typography sx={{ mt: 2, color: 'var(--primary-dark)', fontWeight: 500 }}>
          Loading Event Manager...
        </Typography>
      </Box>
    );
  }

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 2
      }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'var(--primary)',
            mb: 1,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {isAuthenticated && currentUser ? getInitials(currentUser.email) : "?"}
        </Avatar>
        <Typography variant="h6" sx={{ color: 'var(--neutral-dark)' }}>
          {isAuthenticated && currentUser ? currentUser.email : "Guest"}
        </Typography>
      </Box>

      <Divider />

      <List>
        {isAuthenticated ? (
          <>
            <ListItem button component={RouterLink} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={RouterLink} to="/dashboard/create-event">
              <ListItemIcon>
                <AddIcon sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>
              <ListItemText primary="Create Event" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login">
              <ListItemIcon>
                <LoginIcon sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register">
              <ListItemIcon>
                <RegisterIcon sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          color: 'var(--neutral-dark)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'var(--primary-dark)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <EventIcon sx={{ color: 'var(--primary)' }} />
            Event Manager
          </Typography>

          {!isMobile && (
            <>
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{
                      mx: 1,
                      color: 'var(--neutral-medium)',
                      '&:hover': { color: 'var(--primary)' }
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/dashboard/create-event"
                    startIcon={<AddIcon />}
                    sx={{
                      mx: 1,
                      color: 'var(--neutral-medium)',
                      '&:hover': { color: 'var(--primary)' }
                    }}
                  >
                    New Event
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Tooltip title="Account options">
                      <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'var(--primary)',
                            fontSize: '1rem'
                          }}
                        >
                          {currentUser ? getInitials(currentUser.email) : "U"}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      TransitionComponent={Fade}
                      sx={{
                        '& .MuiPaper-root': {
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-lg)',
                          mt: 1.5
                        }
                      }}
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {currentUser && currentUser.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      mx: 1,
                      color: 'var(--neutral-medium)',
                      '&:hover': { color: 'var(--primary)' }
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    startIcon={<RegisterIcon />}
                    sx={{
                      background: 'linear-gradient(to right, var(--primary), var(--primary-dark))',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)',
                      '&:hover': { boxShadow: 'var(--shadow-lg)' }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Container
        sx={{
          mt: 4,
          mb: 6,
          px: { xs: 2, sm: 3, md: 4 }
        }}
        className="fade-in"
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard/*" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="edit-event/:eventId" element={<EditEventPage />} />
          </Route>

          <Route path="/" element={
            <Box
              sx={{
                textAlign: 'center',
                mt: { xs: 5, md: 10 },
                maxWidth: 800,
                mx: 'auto'
              }}
              className="slide-up"
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  color: 'var(--primary-dark)',
                  fontWeight: 800
                }}
              >
                Welcome to the Event Manager
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'var(--neutral-medium)',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Plan, organize, and manage all your events in one place.
                Create stunning events and keep track of your attendees.
              </Typography>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                  size="large"
                  startIcon={<LoginIcon />}
                  sx={{
                    background: 'linear-gradient(to right, var(--primary), var(--primary-dark))',
                    borderRadius: 'var(--radius-md)',
                    px: 4,
                    py: 1.5,
                    boxShadow: 'var(--shadow-md)',
                    '&:hover': {
                      boxShadow: 'var(--shadow-lg)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                  size="large"
                  sx={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'var(--primary-dark)',
                      backgroundColor: 'rgba(94, 96, 206, 0.04)'
                    }
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          } />
        </Routes>
      </Container>
    </>
  );
}

export default App;
