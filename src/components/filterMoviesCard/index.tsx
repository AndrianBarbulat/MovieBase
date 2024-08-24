import React, { ChangeEvent } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FilterOption, GenreData } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from '../spinner';
import { getGenres } from "../../api/tmdb-api";

const cardSx = {
  backgroundColor: 'rgba(13, 27, 42, 0.9)',
  border: '1px solid rgba(245, 197, 24, 0.15)',
  borderRadius: '12px',
  color: 'white',
  mb: 2,
};

const inputSx = {
  width: '100%',
  mt: 1.5,
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
  '& .MuiFilledInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    '&:before': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover:before': { borderColor: 'rgba(245,197,24,0.4)' },
    '&:after': { borderColor: '#F5C518' },
  },
};

const selectFormSx = {
  width: '100%',
  mt: 1.5,
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
};

const sectionTitleSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: 'white',
  fontWeight: 700,
  fontSize: '1rem',
};

interface FilterMoviesCardProps {
  onUserInput: (f: FilterOption, s: string) => void;
  titleFilter: string;
  genreFilter: string;
}

const FilterMoviesCard: React.FC<FilterMoviesCardProps> = ({ titleFilter, genreFilter, onUserInput }) => {
  const { data, error, isLoading, isError } = useQuery<GenreData, Error>("genres", getGenres);

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{(error as Error).message}</h1>;

  const genres = data?.genres || [];
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const handleChange = (e: SelectChangeEvent | ChangeEvent<HTMLInputElement>, type: FilterOption, value: string) => {
    e.preventDefault();
    onUserInput(type, value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e, "title", e.target.value);
  };

  const handleGenreChange = (e: SelectChangeEvent) => {
    handleChange(e, "genre", e.target.value);
  };

  return (
    <>
      {/* Filter card */}
      <Card sx={cardSx} variant="outlined">
        <CardContent>
          <Typography sx={sectionTitleSx}>
            <FilterAltIcon fontSize="small" sx={{ color: '#F5C518' }} />
            Filter
          </Typography>
          <TextField
            sx={inputSx}
            id="filled-search"
            label="Search by title"
            type="search"
            value={titleFilter}
            variant="outlined"
            onChange={handleTextChange}
          />
          <FormControl sx={selectFormSx}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genreFilter}
              label="Genre"
              onChange={handleGenreChange}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: '#0d1b2a', color: 'white', border: '1px solid rgba(245,197,24,0.2)' },
                },
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id} sx={{ '&:hover': { color: '#F5C518' } }}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Sort card */}
      <Card sx={cardSx} variant="outlined">
        <CardContent>
          <Typography sx={sectionTitleSx}>
            <SortIcon fontSize="small" sx={{ color: '#F5C518' }} />
            Sort
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
            Sorting options coming soon.
          </Typography>
Sort the movies.
          </Typography>
          {/* Sorting functionality can be added here */}
        </CardContent>
      </Card>
    </>
  );
};

export default FilterMoviesCard;
