import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';import { TextField, Button, Typography, Box, Paper } from '@mui/material';
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

export default function Signup() {
  const { supabase, setSession } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
   const [message, setMessage] = useState('');
 const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
     const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (data.session) {
      setSession(data.session);
      navigate('/');
    } else {
      // Email confirmation required — session will be null until confirmed
      setMessage('Check your email and click the confirmation link to complete signup.');
   }
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
          Create an account
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mb: 3 }}>
          Join MovieBase today
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Typography variant="body2" sx={{ color: '#ef4444' }}>{error}</Typography>
          </Box>
        )}

        {message && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Typography variant="body2" sx={{ color: '#22c55e' }}>{message}</Typography>
          </Box>
        )}
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputSx}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>
        </form>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: '#F5C518', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
      </Link>
                </Box>
            </form>
        </Container>
    );
}
