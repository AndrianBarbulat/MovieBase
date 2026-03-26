import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { AuthContext } from '../components/authenthication/';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(245,197,24,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#F5C518' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
};

export default function Login() {
  const { supabase, setSession } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        navigate('/');
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, [setSession, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'rgba(13, 27, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(245, 197, 24, 0.15)',
          borderRadius: '16px',
          p: 4,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
          <MovieIcon sx={{ color: '#F5C518', fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #F5C518, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.05em',
            }}
          >
            MOVIEBASE
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mb: 3 }}>
          Sign in to your account
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Typography variant="body2" sx={{ color: '#ef4444' }}>{error}</Typography>
          </Box>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputSx}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputSx}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.25,
              background: '#F5C518',
              color: '#0a0f1e',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { background: '#e6b800' },
            }}
          >
            Sign In
          </Button>
        </form>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#F5C518', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
