import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import apiClient from '../apiClient'; // No longer needed for login itself
import { supabase } from '../supabaseClient'; // Import Supabase client
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress, // Import CircularProgress
} from '@mui/material';

// Assuming you pass a function `onLoginSuccess` from App.jsx
function Login({ onLoginSuccess }) {
  const [loginKey, setLoginKey] = useState(''); // State for login key
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call a backend endpoint to validate the login key
      const response = await fetch('/api/login-with-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed.');
      }

      const data = await response.json();

      // Assuming the backend returns a token and user info on successful validation
      // You might need to store the token (e.g., in local storage or cookies)
      // and potentially update the Supabase client's session if needed for RLS.
      console.log('Login successful:', data);

      // For now, we'll simulate a successful login and redirect
      // In a real implementation, you'd handle token storage and session management here.
      const mockUser = { id: 'partner-user', user_metadata: { full_name: 'Partner User' } }; // Mock user for frontend state
      if (onLoginSuccess) {
         onLoginSuccess(mockUser); // Pass mock user to simulate login
      }
      setLoading(false);
      navigate('/'); // Redirect to dashboard

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          HMA Marketing Dashboard Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login-key"
            label="Login Key"
            name="login-key"
            autoFocus
            value={loginKey}
            onChange={(e) => setLoginKey(e.target.value)}
            disabled={loading} // Disable while loading
          />
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // Disable while loading
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
