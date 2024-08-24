import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQueryimpimport {
  AppBar, Toolbar, Typography, IconButton, Button,
  MenuItem, Menu, Select, Box, styled, Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import { useLanguage } from "../../components/language";
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../../supbase';

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const selectSx = {
  color: 'white',
  fontSize: '0.875rem',
  minWidth: 80,
  '& .MuiSelect-icon': { color: '#F5C518' },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
};

const navBtnSx = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: '0.82rem',
  fontWeight: 500,
  textTransform: 'none',
  px: 1.2,
  borderRadius: '6px',
  whiteSpace: 'nowrap',
  minWidth: 0,
  '&:hover': { color: '#F5C518', backgroundColor: 'rgba(245,197,24,0.08)' },
};

const SiteHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  // Breakpoints for progressive collapse
  const isSmall  = useMediaQuery(theme.breakpoints.down("sm"));   // < 600px
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));   // < 900px
  const isLarge  = useMediaQuery(theme.breakpoints.down("lg"));   // < 1200px

  const { language, switchLanguage } = useLanguage();
  const [session, setSession] = useState(null);
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData as any);
      } catch (error) {
        console.error("Error getting session:", error);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session as any);
      });

      return () => listener.subscription.unsubscribe();
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error);
    } else {
      setSession(null);
      navigate("/signin");
    }
  };

  // Shown inline on desktop, in hamburger menu on mobile
  const navOptions = [
    { label: "Home", path: "/" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Search", path: "/search" },
    { label: "Add Movie", path: "/create-movie" },
  ];

  const browseOptions = [
    { label: "Home", path: "/" },
    { label: "Upcoming Movies", path: "/movies/upcoming" },
    { label: "Genres", path: "/genres" },
    { label: "Popular Movies", path: "/popular" },
    { label: "Actors", path: "/actors" },
    { label: "TV Series", path: "/tvseries" },
    { label: "Favorites", path: "/favorites" },
  ];

  const languages = [
    { code: 'en-US', label: 'EN' },
    { code: 'es-ES', label: 'ES' },
    { code: 'fr-FR', label: 'FR' },
    { code: 'de-DE', label: 'DE' },
  ];

  // All menu items for the hamburger (mobile combines nav + browse)
  const allMobileOptions = [
    ...navOptions,
    { label: "—", path: "" },
    ...browseOptions,
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(6, 11, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 197, 24, 0.15)',
        }}
      >
        <Toolbar sx={{ gap: 0.5, minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2 } }}>

          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', mr: 1, flexShrink: 0 }}
          >
            <MovieIcon sx={{ color: '#F5C518', fontSize: { xs: 22, sm: 26 } }} />
            {/* Hide wordmark on very small screens */}
            {!isSmall && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #F5C518, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                MOVIEBASE
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav buttons — hidden below lg */}
          {!isLarge && navOptions.map((opt) => (
            <Button key={opt.label} sx={navBtnSx} onClick={() => navigate(opt.path)}>
              {opt.label}
            </Button>
          ))}

          {/* Browse dropdown — hidden on small screens (in hamburger instead) */}
          {!isMedium && (
            <Select
              value={selection}
              onChange={(e) => {
                setSelection(e.target.value as string);
                navigate(e.target.value as string);
              }}
              displayEmpty
              size="small"
              sx={selectSx}
            >
              <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>Browse</MenuItem>
              {browseOptions.map(option => (
                <MenuItem key={option.label} value={option.path} sx={{ fontSize: '0.875rem' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Language selector — collapsed to 2-letter codes on small screens */}
          {!isSmall && (
            <Select
              value={language}
              onChange={(e) => switchLanguage(e.target.value as string)}
              size="small"
              sx={selectSx}
            >
              {languages.map(lang => (
                <MenuItem key={lang.code} value={lang.code} sx={{ fontSize: '0.875rem' }}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Auth buttons — hidden on small (in hamburger) */}
          {!isSmall && (
            <>
              {!session ? (
                <>
                  <Button
                    onClick={() => navigate("/signin")}
                    sx={{ ...navBtnSx, border: '1px solid rgba(255,255,255,0.2)', px: 1.5 }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/signup")}
                    sx={{
                      background: '#F5C518',
                      color: '#0a0f1e',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textTransform: 'none',
                      px: 1.5,
                      borderRadius: '6px',
                      flexShrink: 0,
                      '&:hover': { background: '#e6b800' },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogout}
                  sx={{ ...navBtnSx, border: '1px solid rgba(255,255,255,0.2)', px: 1.5 }}
                >
                  Logout
                </Button>
              )}
            </>
          )}

          {/* Hamburger — shown below lg */}
          {isLarge && (
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{ color: 'white', ml: 0.5 }}
                size="medium"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    bgcolor: '#0d1b2a',
                    color: 'white',
                    border: '1px solid rgba(245,197,24,0.2)',
                    minWidth: 200,
                    mt: 0.5,
                  },
                }}
              >
                {/* Auth actions at top on very small screens */}
                {isSmall && (
                  <>
                    {!session ? (
                      <>
                        <MenuItem onClick={() => { navigate("/signin"); setAnchorEl(null); }} sx={{ fontSize: '0.875rem', '&:hover': { color: '#F5C518' } }}>
                          Login
                        </MenuItem>
                        <MenuItem onClick={() => { navigate("/signup"); setAnchorEl(null); }} sx={{ fontSize: '0.875rem', color: '#F5C518', fontWeight: 700 }}>
                          Sign Up
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem onClick={() => { handleLogout(); setAnchorEl(null); }} sx={{ fontSize: '0.875rem', '&:hover': { color: '#F5C518' } }}>
                        Logout
                      </MenuItem>
                    )}
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
                    {/* Language options on very small screens */}
                    {languages.map(lang => (
                      <MenuItem
                        key={lang.code}
                        onClick={() => { switchLanguage(lang.code); setAnchorEl(null); }}
                        sx={{ fontSize: '0.875rem', color: language === lang.code ? '#F5C518' : 'white', '&:hover': { color: '#F5C518' } }}
                      >
                        {lang.code === 'en-US' ? 'English' : lang.code === 'es-ES' ? 'Español' : lang.code === 'fr-FR' ? 'Français' : 'Deutsch'}
                      </MenuItem>
                    ))}
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
                  </>
                )}

                {/* Nav options */}
                {navOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => { navigate(opt.path); setAnchorEl(null); }}
                    sx={{ fontSize: '0.875rem', '&:hover': { color: '#F5C518' } }}
                  >
                    {opt.label}
                  </MenuItem>
                ))}

                {/* Browse options (shown in hamburger when Browse dropdown is hidden) */}
                {isMedium && (
                  <>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
                    {browseOptions.map((opt) => (
                      <MenuItem
                        key={opt.label}
                        onClick={() => { navigate(opt.path); setAnchorEl(null); }}
                        sx={{ fontSize: '0.875rem', '&:hover': { color: '#F5C518' } }}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu>
            </>
          )}

> (
              <Button key={opt.label} color="inherit" onClick={() => navigate(opt.path)}>
                {opt.label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
