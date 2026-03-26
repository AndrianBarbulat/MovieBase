import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import GenreItem from '../components/genresPage/index';
import { fetchGenres } from "../api/tmdb-api";
import { Grid, Box, Typography } from '@mui/material';
import { useLanguage } from '../components/language';

const GenresPage = () => {
  const { language } = useLanguage();
  const { data, error, isLoading, isError } = useQuery(['genres', language], () => fetchGenres(language));

  if (isLoading) return <Spinner />;
  if (isError) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #F5C518, #e6a800)', flexShrink: 0 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>Genres</Typography>
      </Box>
      <Grid container spacing={2}>
        {data.genres.map((genre) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
            <GenreItem genre={genre} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GenresPage;
