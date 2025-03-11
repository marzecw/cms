import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Invalid credentials') {
        setError('Invalid username or password. Please use admin/admin123 for testing.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
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
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            For testing, use: admin / admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 