import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleQuestionSubmit = () => {
    if (question.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: question,
        isUser: true
      };
      setMessages(prev => [...prev, userMessage]);
      setQuestion('');
      setIsTyping(true);

      // Имитация ответа бота
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Рандом',
          isUser: false
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: message.isUser ? 'primary.main' : 'white',
                  color: message.isUser ? 'white' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                <Typography>{message.text}</Typography>
              </Box>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                alignSelf: 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                <Typography>...</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Задайте вопрос"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleQuestionSubmit();
            }
          }}
          sx={{ flex: 1 }}
        />
        <IconButton 
          color="primary" 
          onClick={handleQuestionSubmit}
          disabled={!question.trim() || isTyping}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInterface; 