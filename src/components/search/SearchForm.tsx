import { TextField, Button, Box, Checkbox, FormControlLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const inputSx = {
  my: 2,
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

const SearchForm = ({ searchParams, setSearchParams, handleSearch }) => {
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSearch} noValidate sx={{ mb: 2 }}>
      <TextField name="query" label="Search Query" fullWidth value={searchParams.query} onChange={handleChange} sx={inputSx} />
      <TextField name="primaryReleaseYear" label="Primary Release Year" type="number" fullWidth value={searchParams.primaryReleaseYear} onChange={handleChange} sx={inputSx} />
      <TextField name="year" label="Year" type="number" fullWidth value={searchParams.year} onChange={handleChange} sx={inputSx} />
      <TextField name="region" label="Region" fullWidth value={searchParams.region} onChange={handleChange} sx={inputSx} />
      <FormControlLabel
        control={<Checkbox checked={searchParams.includeAdult} onChange={handleChange} name="includeAdult" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#F5C518' } }} />}
        label="Include All genres"
        sx={{ color: 'rgba(255,255,255,0.7)' }}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            background: '#F5C518',
            color: '#0a0f1e',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': { background: '#e6b800' },
          }}
        >
          Search
        </Button>
      </Box>
imary" sx={{ mt: 2 }}>
        Search
      </Button>
    </Box>
  );
};

export default SearchForm;
