import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/authenthication';
import {
  CircularProgress, Typography, Box, Container, Card, CardMedia,
  CardContent, Grid, MenuItem, FormControl, InputLabel, Select,
  Pagination, Chip
} from "@mui/material";
import { Link } from "react-router-dom";
import StarRateIcon from '@mui/icons-material/StarRate';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const paginationSx = {
  '& .MuiPaginationItem-root': { color: 'white !important' },
  '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 },
  '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' },
  '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' },
};

const FavoritesPage = () => {
  const { supabase } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        const { data, error, count } = await supabase
          .from('favorites')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: sortOrder === 'asc' })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

        if (error) {
          setError('Failed to fetch favorites');
        } else {
          setFavorites(data);
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      } else {
        setError('No user session found');
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [supabase.auth, sortOrder, page]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress sx={{ color: '#F5C518' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #F5C518, #e6a800)', flexShrink: 0 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>My Favorites</Typography>
      </Box>

      {/* Sort */}
      <Box sx={{ mb: 3, maxWidth: 220 }}>
        <FormControl fullWidth sx={{
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
          '& .MuiOutlinedInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(245,197,24,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#F5C518' } },
          '& .MuiSelect-icon': { color: '#F5C518' },
        }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select labelId="sort-label" value={sortOrder} label="Sort By" onChange={(e) => setSortOrder(e.target.value)}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#0d1b2a', color: 'white', border: '1px solid rgba(245,197,24,0.2)' } } }}>
            <MenuItem value="desc">Most Recent</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                sx={{
                  backgroundColor: '#0d1b2a',
                  color: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(245,197,24,0.35)' },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 360, objectFit: 'cover' }}
                    image={movie.image_url ? `https://image.tmdb.org/t/p/w500${movie.image_url}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={movie.title}
                  />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(13,27,42,1), transparent)' }} />
                  <Chip
                    icon={<StarRateIcon sx={{ color: '#F5C518 !important', fontSize: '0.85rem' }} />}
                    label={Math.round((movie.rating || 0) * 10) / 10}
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.75)', color: '#F5C518', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(245,197,24,0.3)' }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {movie.overview}
                  </Typography>
                </CardContent>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Link to={`/movies/${movie.movie_id}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#F5C518', fontSize: '0.85rem', fontWeight: 600, py: 0.75, borderRadius: '6px', border: '1px solid rgba(245,197,24,0.4)', transition: 'all 0.2s', '&:hover': { backgroundColor: '#F5C518', color: '#0a0f1e' } }}>
                      <InfoOutlinedIcon sx={{ fontSize: '0.9rem' }} /> Details
                    </Box>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)' }}>You haven't added any favorites yet.</Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} sx={paginationSx} />
        </Box>
      )}
    </Box>
  );
};

export default FavoritesPage;
