import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Grid, Typography, Card, CardContent, CardMedia, TextField,
  MenuItem, FormControl, Select, InputLabel, Box, Pagination, Chip
} from '@mui/material';
import StarRateIcon from '@mui/icons-material/StarRate';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Spinner from '../components/spinner';
import { fetchTVSeries } from '../api/tmdb-api';
import { useLanguage } from '../components/language';
import { SelectChangeEvent } from '@mui/material/Select';

interface Series {
  id: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

interface QueryData {
  results: Series[];
  total_pages: number;
}

const paginationSx = {
  '& .MuiPaginationItem-root': { color: 'white !important' },
  '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 },
  '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' },
  '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(245,197,24,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#F5C518' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
};

const TVSeriesPage = () => {
  const { language } = useLanguage() as { language: string; switchLanguage: (lang: string) => void };
  const [page, setPage] = useState<number>(1);
  const [sortProperty, setSortProperty] = useState<string>('');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [minimumPopularity, setMinimumPopularity] = useState<string>('');

  const { data, error, isLoading, isError } = useQuery<QueryData, Error>(
    ['tvSeries', page, language],
    () => fetchTVSeries(page, language),
    { keepPreviousData: true }
  );

  if (isLoading) return <Spinner />;
  if (isError && error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

  const filteredAndSortedSeries = (data?.results || [])
    .filter(s => (!releaseYear || s.first_air_date?.startsWith(releaseYear)) && (!minimumPopularity || s.popularity >= parseInt(minimumPopularity)))
    .sort((a, b) => {
      if (!sortProperty) return 0;
      return sortProperty === 'popularity'
        ? b.popularity - a.popularity
        : new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime();
    });

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #F5C518, #e6a800)', flexShrink: 0 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>Popular TV Series</Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 180, ...{ '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' }, '& .MuiOutlinedInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(245,197,24,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#F5C518' } }, '& .MuiSelect-icon': { color: '#F5C518' } } }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select labelId="sort-label" value={sortProperty} onChange={(e: SelectChangeEvent<string>) => setSortProperty(e.target.value)} displayEmpty label="Sort By"
            MenuProps={{ PaperProps: { sx: { bgcolor: '#0d1b2a', color: 'white', border: '1px solid rgba(245,197,24,0.2)' } } }}>
            <MenuItem value=""><em>Default</em></MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="first_air_date">Air Date</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Release Year" type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} sx={{ minWidth: 160, ...inputSx }} />
        <TextField label="Min. Popularity" type="number" value={minimumPopularity} onChange={e => setMinimumPopularity(e.target.value)} sx={{ minWidth: 160, ...inputSx }} />
      </Box>

      {/* Cards */}
      <Grid container spacing={3}>
        {filteredAndSortedSeries.map((series) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={series.id}>
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
                  sx={{ height: 320, objectFit: 'cover' }}
                  image={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.name}
                />
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(13,27,42,1), transparent)' }} />
                <Chip
                  icon={<StarRateIcon sx={{ color: '#F5C518 !important', fontSize: '0.85rem' }} />}
                  label={Math.round(series.vote_average * 10) / 10}
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.75)', color: '#F5C518', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(245,197,24,0.3)' }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.75, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  <RouterLink to={`/series/${series.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {series.name}
                  </RouterLink>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    {series.first_air_date ? new Date(series.first_air_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {series.overview}
                </Typography>
              </CardContent>
              <Box sx={{ px: 2, pb: 2 }}>
                <RouterLink to={`/series/${series.id}`} style={{ textDecoration: 'none' }}>
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

export default TVSeriesPage;
