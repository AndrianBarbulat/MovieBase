import React from "react";
import { Box, Typography } from "@mui/material";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Box
      sx={{
        py: 3,
        px: 1,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 4,
          height: 36,
          borderRadius: 2,
          background: 'linear-gradient(180deg, #F5C518, #e6a800)',
          flexShrink: 0,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default Header;

};

export default Header;