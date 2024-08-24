import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, IconButton, Typography, Chip } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

interface MovieHeaderProps {
  title: string;
  homepage: string;
  tagline: string;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ title, homepage, tagline }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    const isFav = favourites.some((movie: any) => movie.id.toString() === id);
    setIsFavourite(isFav);
  }, [id]);

  return (
    <Box
      sx={{
        background: 'rgba(13, 27, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(245, 197, 24, 0.12)',
        px: 3,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <IconButton
        aria-label="go back"
        onClick={() => navigate(-1)}
        sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#F5C518' } }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}
          >
            {title}
          </Typography>
          {isFavourite && (
            <Chip
              icon={<FavoriteIcon sx={{ fontSize: '0.85rem !important', color: '#ef4444 !important' }} />}
              label="Favourite"
              size="small"
              sx={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}
            />
          )}
          {homepage && (
            <IconButton
              component="a"
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#F5C518', '&:hover': { color: '#e6b800' } }}
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {tagline && (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', mt: 0.25 }}>
            "{tagline}"
          </Typography>
        )}
      </Box>
    </Box>
primary" fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default MovieHeader;
