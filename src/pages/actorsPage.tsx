import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import { Grid, Typography, Card, CardMedia, CardContent, Box, Pagination, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { fetchPopularActors } from '../api/tmdb-api';
import { useLanguage } from '../components/language';

interface Actor {
  id: number;
  profile_path: string;
  name: string;
  known_for: { title?: string; name?: string }[];
}

interface LanguageContextType {
  language: string;
}

const paginationSx = {
  '& .MuiPaginationItem-root': { color: 'white !important' },
  '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 },
  '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' },
  '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' },
};

const ActorsPage = () => {
  const { language } = useLanguage() as LanguageContextType;
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading, isError } = useQuery<{ results: Actor[]; total_pages: number }, Error>(
    ['popularActors', page, language],
    () => fetchPopularActors(page, language)
  );

  if (isLoading) return <Spinner />;
  if (isError && error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #F5C518, #e6a800)', flexShrink: 0 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>Popular Actors</Typography>
      </Box>

      <Grid container spacing={3}>
        {data?.results.map((actor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id} sx={{ display: 'flex' }}>
            <Card
              sx={{
                width: '100%',
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
                  sx={{ height: 520, objectFit: 'cover', objectPosition: 'top' }}
                  image={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={actor.name}
                />
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(13,27,42,1), transparent)' }} />
                <Chip
                  icon={<PersonIcon sx={{ color: '#F5C518 !important', fontSize: '0.85rem' }} />}
                  label="Actor"
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.75)', color: '#F5C518', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(245,197,24,0.3)' }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {actor.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Known for: {actor.known_for.map(m => m.title || m.name).filter(Boolean).join(', ')}
                </Typography>
              </CardContent>
              <Box sx={{ px: 2, pb: 2 }}>
                <RouterLink to={`/actors/${actor.id}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#F5C518', fontSize: '0.85rem', fontWeight: 600, py: 0.75, borderRadius: '6px', border: '1px solid rgba(245,197,24,0.4)', transition: 'all 0.2s', '&:hover': { backgroundColor: '#F5C518', color: '#0a0f1e' } }}>
                    <InfoOutlinedIcon sx={{ fontSize: '0.9rem' }} /> Details
                  </Box>
                </RouterLink>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data && data.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={data.total_pages} page={page} onChange={(_, v) => setPage(v)} sx={paginationSx} />
        </Box>
      )}
    </Box>
  );
};

export default ActorsPage;
