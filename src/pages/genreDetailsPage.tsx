import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import MovieCard from '../components/movieCard';
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites'; 
import { Grid, Paper, Typography, Pagination } from '@mui/material';
import { fetchGenreMovies } from "../api/tmdb-api";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    popularity: number;
    release_date: string;
    vote_count: number;
}

const GenreDetailsPage = () => {
    const { genreId } = useParams<{ genreId: string }>();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, error, isLoading, isError } = useQuery<{ results: Movie[], total_pages: number }, Error>(
        ['genreMovies', genreId, currentPage], 
        () => fetchGenreMovies(genreId!, currentPage),  
        {
            keepPreviousData: true,
            onSuccess: (data) => {
                console.log("Fetched genre movies data:", data);
            }
        }
    );

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (isLoading) return <Spinner />;
    if (isError) return <Typography variant="h6" color="error">Error: {error?.message}</Typography>;

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h4" gutterBottom>Movies in this Genre</Typography>
            <Grid container spacing={2}>
                {data?.results.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <MovieCard 
                            movie={movie}
                            action={(movie) => (
                                <AddToFavouritesIcon
                                    movie_id={movie.id}
                                    image_url={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    rating={movie.vote_average}
                                    title={movie.title}
                                    overview={movie.overview}
                                    popularity={movie.popularity}
                                    release_date={movie.release_date}
                                    vote_count={movie.vote_count}
                                />
                            )}
                        /> 
                    </Grid>
                ))}
            </Grid>
            {data && data.total_pages > 1 && (
                <Pagination
                    count={data.total_pages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center', '& .MuiPaginationItem-root': { color: 'white !important' }, '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#F5C518 !important', color: '#0a0f1e !important', fontWeight: 700 }, '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(245,197,24,0.15) !important' }, '& .MuiPaginationItem-root.Mui-disabled': { color: 'rgba(255,255,255,0.3) !important' } }}
                />
            )}
        </Paper>
    );
};

export default GenreDetailsPage;
