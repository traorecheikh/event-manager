import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Link,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';

import '../styles/AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setMessage(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fade in={true} timeout={800}>
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          className="auth-card"
          sx={{
            mt: { xs: 4, sm: 8 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box className="auth-header">
            <Typography
              component="h1"
              variant="h4"
              className="auth-title"
            >
              Welcome Back
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              Sign in to continue to Event Manager
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
            className="auth-form"
          >
            <div className="form-field">
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'var(--primary)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="form-field">
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'var(--primary)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            {message && (
              <Alert
                severity="error"
                sx={{ mt: 2, borderRadius: 'var(--radius-md)' }}
                className="bounce-in"
              >
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              className="auth-submit-button"
              startIcon={!isLoading && <LoginIcon />}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box className="auth-links">
              <Link
                component={RouterLink}
                to="/register"
                className="auth-link"
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>

          <div className="auth-decoration-circle auth-circle-1"></div>
          <div className="auth-decoration-circle auth-circle-2"></div>
        </Paper>
      </Container>
    </Fade>
  );
}

export default LoginPage;

