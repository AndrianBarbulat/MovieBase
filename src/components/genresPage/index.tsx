import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters';

interface GenreItemProps {
  genre: {
    id: number;
    name: string;
  };
}

const GenreItem: React.FC<GenreItemProps> = ({ genre }) => {
  return (
    <Link to={`/genres/${genre.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 2,
          borderRadius: '10px',
          backgroundColor: 'rgba(13, 27, 42, 0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#F5C518',
            backgroundColor: 'rgba(245,197,24,0.08)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          },
        }}
      >
        <TheatersIcon sx={{ color: '#F5C518', fontSize: 20, flexShrink: 0 }} />
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
          {genre.name}
        </Typography>
      </Box>
    </Link>
  );
};

export default GenreItem;
