import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative',
        mb: 2
      }}>
        <Box
          component="img"
          src="/src/assets/F-G.svg"
          alt="Logo"
          sx={{ 
            height: 56,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/')}
        />
        <Box sx={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: 'Cruinn',
              color: 'primary.main',
              fontSize: '48px'
            }}
          >
            Конференц-Бот
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 4 }} />
    </Box>
  );
}; 