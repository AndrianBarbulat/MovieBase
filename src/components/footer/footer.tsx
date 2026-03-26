import { Link } from 'react-router-dom';
import { Box, Typography, Container, Divider } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Upcoming", path: "/movies/upcoming" },
  { label: "Genres", path: "/genres" },
  { label: "Popular", path: "/popular" },
  { label: "Actors", path: "/actors" },
  { label: "TV Series", path: "/tvseries" },
  { label: "Favorites", path: "/favorites" },
];

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'rgba(6, 11, 20, 0.95)',
        borderTop: '1px solid rgba(245, 197, 24, 0.15)',
        pt: 4,
        pb: 3,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Top row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3, justifyContent: 'space-between' }}>
          {/* Brand */}
          <Box sx={{ minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MovieIcon sx={{ color: '#F5C518', fontSize: 22 }} />
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
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', maxWidth: 260, lineHeight: 1.6 }}>
              Explore the world of movies and TV series. Discover actors, genres, and upcoming hits.
            </Typography>
          </Box>

          {/* Navigation links */}
          <Box>
            <Typography variant="overline" sx={{ color: '#F5C518', letterSpacing: '0.1em', fontWeight: 600, display: 'block', mb: 1.5 }}>
              Browse
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, maxWidth: 400 }}>
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.55)',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#F5C518' },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2 }} />

        {/* Bottom row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} MovieBase. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', maxWidth: 480, textAlign: 'right' }}>
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
