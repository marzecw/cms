import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken, setUser } = useAuth();

  useEffect(() => {
    const processToken = async () => {
      try {
        // Get token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          console.error('No token found in URL');
          navigate('/login');
          return;
        }

        // Store token in local storage
        localStorage.setItem('token', token);
        setAuthToken(token);

        // Decode JWT to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const payload = JSON.parse(jsonPayload);
        setUser(payload.user);

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/login');
      }
    };

    processToken();
  }, [location, navigate, setAuthToken, setUser]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Logging you in...
      </Typography>
    </Box>
  );
};

export default GoogleCallback; 