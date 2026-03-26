import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardActions, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import img from '../../images/film-poster-placeholder.png';
import { MoviesContext } from "../../contexts/moviesContext";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
  action: (props: Movie & { iconColor: string }) => JSX.Element;
  onUpcomingPage?: boolean;
}

interface MovieContextInterface {
  favourites: number[];
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, action, onUpcomingPage }) => {
  const { favourites } = useContext(MoviesContext) as MovieContextInterface;
  const isFavourite = favourites.includes(movie.id);
  const iconColor = onUpcomingPage && isFavourite ? '#ef4444' : '#F5C518';
  const rating = Math.round(movie.vote_average * 10) / 10;

  return (
    <Card
      sx={{
        backgroundColor: '#0d1b2a',
        color: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          borderColor: 'rgba(245,197,24,0.35)',
        },
      }}
    >
      {/* Poster with rating badge */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="380"
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : img}
          alt={movie.title}
          sx={{ objectFit: 'cover' }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, rgba(13,27,42,1), transparent)',
          }}
        />
        {/* Rating badge */}
        <Chip
          icon={<StarRateIcon sx={{ color: '#F5C518 !important', fontSize: '0.85rem' }} />}
          label={rating}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#F5C518',
            fontWeight: 700,
            fontSize: '0.8rem',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(245,197,24,0.3)',
          }}
        />
      </Box>

      <CardContent sx={{ pb: 0, pt: 1.5, px: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            lineHeight: 1.3,
            mb: 0.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          <CalendarTodayIcon sx={{ fontSize: '0.8rem' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            {movie.release_date}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {action && action({ ...movie, iconColor })}
        </Box>
        <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#F5C518',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 1.5,
              py: 0.75,
              borderRadius: '6px',
              border: '1px solid rgba(245,197,24,0.4)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#F5C518', color: '#0a0f1e' },
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: '0.9rem' }} />
            Details
          </Box>
        </Link>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
