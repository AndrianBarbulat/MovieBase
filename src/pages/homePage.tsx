import { useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import { MenuItem, FormControl, Select, InputLabel, Box, Pagination, Typography } from '@mui/material';
import { useLanguage } from "../components/language";

interface Movie {
    id: number;
    title: string;
    genre_ids: number[];
    release_date: string;
    runtime: number;
    poster_path: string;
    vote_average: number;
    popularity: number;
    vote_count: number;
}

interface LanguageContextType {
    language: string;
    switchLanguage: (lang: string) => void;
}

const HomePage = () => {
    const [page, setPage] = useState(1);
    const [sortProperty, setSortProperty] = useState<string>('');
    const { language, switchLanguage } = useLanguage() as LanguageContextType; 

    const { data, error, isLoading, isError } = useQuery<{results: Movie[], total_pages: number}, Error>(
        ['discover', page, language], 
        () => getMovies(page, language),
        {
            keepPreviousData: true
        }
    );

    const { filterFunction } = useFiltering<Movie>([
        { name: "title", value: "", condition: (movie: Movie, value: string) => !value || movie.title.toLowerCase().includes(value.toLowerCase()) },
        { name: "genre", value: "", condition: (movie: Movie, value: string) => !value || movie.genre_ids.includes(parseInt(value)) },
        { name: "releaseYear", value: "", condition: (movie: Movie, year: string) => !year || (movie.release_date && movie.release_date.startsWith(year)) },
        { name: "runtime", value: "", condition: (movie: Movie, runtime: string) => !runtime || (movie.runtime && movie.runtime <= parseInt(runtime)) }
    ]);

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortProperty(event.target.value as string);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const sortedAndFilteredMovies = filterFunction(data ? data.results : []).sort((a: Movie, b: Movie) => {
        if (!sortProperty) return 0;
        if (sortProperty === 'popularity' || sortProperty === 'runtime') {
            return (b[sortProperty as keyof Movie] as number) - (a[sortProperty as keyof Movie] as number);
        } else if (sortProperty === 'release_date') {
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        }
        return 0;
    });

    if (isLoading) return <Spinner />;
    if (isError) return <Typography variant="h6" color="error">Error: {error?.message}</Typography>;

    return (
        <>
            <Box sx={{ padding: '20px', backgroundColor: 'transparent' }}>
                <FormControl fullWidth sx={{
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
                    '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                        '&:hover fieldset': { borderColor: 'rgba(245,197,24,0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#F5C518' },
                    },
                    '& .MuiSelect-icon': { color: '#F5C518' },
                }}>
                    <InputLabel id="sort-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortProperty}
                        onChange={handleSortChange}
                        displayEmpty
                        MenuProps={{ PaperProps: { sx: { bgcolor: '#0d1b2a', color: 'white', border: '1px solid rgba(245,197,24,0.2)' } } }}
                    >
                        <MenuItem value=""><em>Sort By</em></MenuItem>
                        <MenuItem value="popularity">Popularity</MenuItem>
                        <MenuItem value="release_date">Release Date</MenuItem>
                        <MenuItem value="runtime">Runtime</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <PageTemplate 
                title="Discover Movies"
                movies={sortedAndFilteredMovies}
                action={(movie: Movie) => <AddToFavouritesIcon
                    movie_id={movie.id}
                    image_url={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    rating={movie.vote_average}
                    title={movie.title}
                    overview={movie.title} // Assuming overview is mistakenly replaced
                    popularity={movie.popularity}
                    release_date={movie.release_date}
                    vote_count={movie.vote_count}
                />}
            />
            {data?.total_pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination
                        count={data.total_pages}
                        page={page}
                        onChange={handlePageChange}
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

export default HomePage;
