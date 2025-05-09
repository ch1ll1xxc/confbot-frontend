import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        position: 'relative',
        height: '80px'
      }}>
        <Box
          component="img"
          src="/src/assets/F-G.svg"
          alt="Logo"
          sx={{ 
            height: '60px',
            position: 'absolute',
            left: 0
          }}
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'primary.main',
            fontFamily: 'Cruinn, system-ui, Avenir, Helvetica, Arial, sans-serif'
          }}
        >
          Конференц-бот
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />
    </>
  );
}; 