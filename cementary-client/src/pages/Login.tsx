import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error parameter in URL
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    if (errorParam === 'auth_failed') {
      setError('Google authentication failed. Please try again or use email/password login.');
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      window.location.href = '/';
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      console.log('Attempting to login with:', username, password);
      await login({ username, password });
      window.location.href = '/';
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Invalid credentials') {
        setError('Invalid username or password. Please use admin/admin123 for testing.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          fontWeight="500"
          sx={{ mb: 4 }}
        >
          Log in
        </Typography>
        
        <Box sx={{ width: '100%', mb: 3, borderBottom: '1px solid #e0e0e0' }} />
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Email
          </Typography>
          <TextField
            margin="none"
            required
            fullWidth
            id="username"
            placeholder="your.email@example.com"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Password
          </Typography>
          <TextField
            margin="none"
            required
            fullWidth
            name="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Link href="#" variant="body2" underline="hover">
              Forgot Password
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: '#1a1a1a',
              '&:hover': {
                backgroundColor: '#333',
              },
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Log in'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              borderColor: '#ddd',
              color: '#333',
              '&:hover': {
                borderColor: '#aaa',
                backgroundColor: '#f5f5f5',
              },
            }}
            disabled={loading}
          >
            Continue with Google
          </Button>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> After clicking "Continue with Google" and authorizing, you'll be automatically redirected to the dashboard.
            </Typography>
          </Alert>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            For testing, use: admin / admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 