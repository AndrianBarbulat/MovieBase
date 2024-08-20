import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import { Grid, Paper, Typography, Box, Pagination } from '@mui/material';
import MovieCard from '../components/movieCard'; 
import { fetchPopularMovies } from '../api/tmdb-api';
import { useLanguage } from '../components/language';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
    popularity: number;
}

interface LanguageContextType {
    language: string;
}

const PopularMoviesPage = () => {
    const { language } = useLanguage() as LanguageContextType;
    const [page, setPage] = useState(1);

    const { data, error, isLoading, isError } = useQuery<{ results: Movie[], total_pages: number }, Error>(
        ['popularMovies', page, language],
        () => fetchPopularMovies(page, language)
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value); 
    };

    if (isLoading) return <Spinner />;
    if (isError) return <Typography variant="h6" color="error">Error: {(error as Error).message}</Typography>;

    return (
        <Paper style={{ padding: '20px', margin: '20px', backgroundColor: 'transparent' }}> 
            <Typography variant="h4" gutterBottom>Popular Movies</Typography>
            <Grid container spacing={2}>
                {data?.results.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <MovieCard movie={movie} />  
                    </Grid>
                ))}
            </Grid>
            {data?.total_pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination count={data.total_pages} page={page} onChange={handlePageChange} sx={{ '& .MuiPaginationItem-root': { color: 'white !important' }, '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 }, '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' }, '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' } }} />
                </Box>
            )}
        </Paper>
    );
};

export default PopularMoviesPage;
