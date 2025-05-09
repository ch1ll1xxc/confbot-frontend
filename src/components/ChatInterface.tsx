import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

interface ChatInterfaceProps {
  shouldStartTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ shouldStartTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (shouldStartTyping) {
      setIsTyping(true);
      let currentIndex = 0;
      const typingSpeed = 30;

      const typingInterval = setInterval(() => {
        if (currentIndex < loremIpsum.length) {
          setDisplayedText(prev => prev + loremIpsum[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }
  }, [shouldStartTyping]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        backgroundColor: 'background.paper'
      }}
    >
      <TextField
        fullWidth
        placeholder="Поиск по анализу конференции..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.1)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main'
            }
          }
        }}
        sx={{ mb: 3 }}
      />

      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 500
        }}
      >
        Анализ конференции
      </Typography>
      
      <Box sx={{ 
        overflowY: 'auto',
        p: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 8,
        position: 'relative',
        height: '400px',
        maxHeight: '400px',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}>
        <AnimatePresence>
          {shouldStartTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  color: 'text.primary',
                  pr: 1
                }}
              >
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ marginLeft: 4 }}
                  >
                    |
                  </motion.span>
                )}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
}; 