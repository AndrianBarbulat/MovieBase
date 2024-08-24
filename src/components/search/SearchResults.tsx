import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Link, Box, Pagination } from '@mui/material';

const SearchResults = ({ movies, page, total_pages, onPageChange }) => {
  return (
    <>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ height: 340, objectFit: 'cover' }}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  <Link href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                    {movie.title}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Release Date: {movie.release_date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
          count={total_pages}
          page={page}
          onChange={onPageChange}
          sx={{
            '& .MuiPaginationItem-root': { color: 'white !important' },
            '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 },
            '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' },
            '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' },
          }}
        />
        </Box>
      )}
    </>
  );
};

export default SearchResults;
