import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Immediately check if we already have authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('Already authenticated, redirecting to dashboard immediately');
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    console.log('GoogleCallback component mounted');
    console.log('Current location:', location);
    
    // Set a timeout to automatically redirect to dashboard
    const redirectTimeout = setTimeout(() => {
      console.log('Auto-redirecting to dashboard after timeout');
      window.location.href = '/';
    }, 5000); // Auto-redirect after 5 seconds
    
    // Countdown timer for auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Force redirect when countdown reaches 0
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    const processToken = async () => {
      try {
        // Get token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        console.log('GoogleCallback: URL search params:', location.search);
        console.log('GoogleCallback: Token from URL:', token);

        if (!token) {
          console.error('No token found in URL');
          
          // Check if we already have a token in localStorage
          const storedToken = localStorage.getItem('token');
          if (storedToken) {
            console.log('Found token in localStorage, redirecting to dashboard');
            window.location.href = '/';
            return;
          }
          
          setError('No authentication token found. Please try logging in again.');
          setLoading(false);
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        // Store token in local storage
        console.log('Storing token in localStorage');
        localStorage.setItem('token', token);
        setAuthToken(token);
        console.log('Token stored and set in auth context');

        // Decode JWT to get user info
        try {
          console.log('Attempting to decode JWT token');
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          const payload = JSON.parse(jsonPayload);
          console.log('GoogleCallback: Decoded token payload:', payload);
          
          // Check if payload has user info
          if (!payload.user && payload.sub) {
            // If payload doesn't have user object but has sub (user ID), create a minimal user object
            console.log('Creating user object from token payload');
            const user = {
              id: payload.sub,
              username: payload.username || payload.email,
              email: payload.email,
              firstName: payload.firstName || '',
              lastName: payload.lastName || '',
              role: payload.role || 'user',
              tenantId: payload.tenantId || 1,
            };
            console.log('GoogleCallback: Created user object from payload:', user);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          } else if (payload.user) {
            console.log('Using user object from payload');
            console.log('GoogleCallback: Using user object from payload:', payload.user);
            setUser(payload.user);
            localStorage.setItem('user', JSON.stringify(payload.user));
          } else {
            console.error('Invalid token payload structure:', payload);
            throw new Error('Invalid token payload structure');
          }
          
          // Redirect to home page
          console.log('Authentication successful, redirecting to home page');
          window.location.href = '/';
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setError('Error processing authentication token. Please try logging in again.');
          setLoading(false);
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }
      } catch (error) {
        console.error('Error processing Google callback:', error);
        setError('Authentication failed. Please try logging in again.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    processToken();
    
    // Clean up timeouts and intervals
    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [location, setAuthToken, setUser]);

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
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 4 }}>
            Logging you in... Auto-redirecting in {countdown} seconds
          </Typography>
        </>
      )}
    </Box>
  );
};

export default GoogleCallback; 