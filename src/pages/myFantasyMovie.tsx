import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/authenthication';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Input, Grid, Card, CardMedia, CardContent } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  marginBottom: '12px',
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
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputBase-inputMultiline': { color: 'white' },
});

const StyledFormControl = styled(FormControl)({
  marginBottom: '12px',
  width: '100%',
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
});

const GreenButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#F5C518',
    '&:hover': { backgroundColor: '#e6b800' },
    color: '#0a0f1e',
    fontWeight: 700,
    borderRadius: '8px',
    textTransform: 'none',
    margin: theme.spacing(1, 0),
    width: '100%',
}));

const initialMovieState = {
    title: '',
    overview: '',
    genre: '',
    releaseDate: '',
    runtime: '',
    productionCompany: '',
    director: '',
    budget: ''
};

interface CastMember {
  name: string;
  role: string;
  description: string;
}

const FantasyMovieForm = () => {
    const { supabase } = useContext(AuthContext) as { supabase: any }; 
    const [user, setUser] = useState<any>(null);
    const [movies, setMovies] = useState<any[]>([]);
    const [movie, setMovie] = useState(initialMovieState);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [poster, setPoster] = useState<File | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user);
        };

        checkSession();
        fetchMovies();
        const { data: listener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            setUser(session?.user);
            fetchMovies();
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const fetchMovies = async () => {
        const { data, error } = await supabase.from('myfantasymovie').select('*');
        if (error) {
            console.error('Error fetching movies:', error);
        } else {
            setMovies(data);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMovie(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPoster(event.target.files[0]);
        }
    };

    const handleCastChange = (index: number, field: keyof CastMember, value: string) => {
        const newCast = [...cast];
        newCast[index][field] = value;
        setCast(newCast);
    };

    const addCastMember = () => {
        setCast([...cast, { name: '', role: '', description: '' }]);
    };

    const removeCastMember = (index: number) => {
        setCast(cast.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            alert("Please log in to create a fantasy movie.");
            return;
        }

        let posterUrl = '';
        if (poster) {
            const fileExt = poster.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('posters')
                .upload(fileName, poster);

            if (uploadError) {
                console.error('Failed to upload image:', uploadError);
                alert(`Failed to upload image: ${uploadError.message}`);
                return;
            }

            posterUrl = `https://wbzxjkoeievktfrsgsbo.supabase.co/storage/v1/object/public/posters/${fileName}`;
        }

        try {
            const { error } = await supabase.from('myfantasymovie').insert([{
                ...movie,
                user_id: user.id,
                poster: posterUrl,
                releaseDate: new Date(movie.releaseDate).toISOString(),
                cast: JSON.stringify(cast)
            }]);
            if (!error) {
                alert("Movie added successfully!");
                setMovie(initialMovieState);
                setCast([]);
                setPoster(null);
                fetchMovies();  // Refresh the list of movies
            } else {
                console.error('Failed to add movie:', error);
                alert("Failed to add movie. Please try again.");
            }
        } catch (error) {
            console.error('Failed to add movie:', error);
            alert("Failed to add movie. Please try again.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <StyledTextField name="title" label="Title" value={movie.title} onChange={handleChange} fullWidth required />
                <StyledTextField name="overview" label="Overview" value={movie.overview} onChange={handleChange} fullWidth multiline rows={4} required />
                <StyledFormControl fullWidth required>
                    <InputLabel>Genre</InputLabel>
                    <Select name="genre" value={movie.genre} onChange={handleChange} label="Genre" MenuProps={{ PaperProps: { sx: { bgcolor: '#0d1b2a', color: 'white', border: '1px solid rgba(245,197,24,0.2)' } } }}>
                        <MenuItem value="Action">Action</MenuItem>
                        <MenuItem value="Comedy">Comedy</MenuItem>
                        <MenuItem value="Drama">Drama</MenuItem>
                        <MenuItem value="Fantasy">Fantasy</MenuItem>
                        <MenuItem value="Horror">Horror</MenuItem>
                        <MenuItem value="Mystery">Mystery</MenuItem>
                        <MenuItem value="Romance">Romance</MenuItem>
                        <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                        <MenuItem value="Western">Western</MenuItem>
                    </Select>
                </StyledFormControl>
                <StyledTextField name="releaseDate" type="date" value={movie.releaseDate} onChange={handleChange} fullWidth required />
                <StyledTextField name="runtime" label="Runtime" type="number" value={movie.runtime} onChange={handleChange} fullWidth required />
                <StyledTextField name="productionCompany" label="Production Company" value={movie.productionCompany} onChange={handleChange} fullWidth required />
                <StyledTextField name="director" label="Director" value={movie.director} onChange={handleChange} fullWidth required />
                <StyledTextField name="budget" label="Budget" type="number" value={movie.budget} onChange={handleChange} fullWidth required />
                <Input type="file" onChange={handleFileChange} fullWidth required />
                {cast.map((member, index) => (
                    <div key={index} style={{ width: '100%' }}>
                        <StyledTextField label="Cast Name" value={member.name} onChange={(e) => handleCastChange(index, 'name', e.target.value)} fullWidth required />
                        <StyledTextField label="Role" value={member.role} onChange={(e) => handleCastChange(index, 'role', e.target.value)} fullWidth required />
                        <StyledTextField label="Description" value={member.description} onChange={(e) => handleCastChange(index, 'description', e.target.value)} fullWidth required />
                        <IconButton onClick={() => removeCastMember(index)}><RemoveCircleOutlineIcon /></IconButton>
                    </div>
                ))}
                <GreenButton onClick={addCastMember} startIcon={<AddCircleOutlineIcon />} fullWidth>Add Cast Member</GreenButton>
                <GreenButton type="submit" variant="contained" fullWidth>Create Movie</GreenButton>
            </form>
            <Grid container spacing={2}>
                {movies.map((m, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={m.poster || 'https://via.placeholder.com/500'}
                                alt={m.title}
                                style={{ height: 500 }}
                            />
                            <CardContent>
                                <Typography variant="h6">{m.title}</Typography>
                                <Typography variant="body2">{m.overview}</Typography>
                                <Typography variant="body2">Genre: {m.genre}</Typography>
                                <Typography variant="body2">Release Date: {new Date(m.releaseDate).toDateString()}</Typography>
                                <Typography variant="body2">Runtime: {m.runtime} minutes</Typography>
                                <Typography variant="body2">Production: {m.productionCompany}</Typography>
                                <Typography variant="body2">Director: {m.director}</Typography>
                                <Typography variant="body2">Budget: ${m.budget}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default FantasyMovieForm;
