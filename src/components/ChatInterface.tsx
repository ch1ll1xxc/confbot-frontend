import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, Button, Alert, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import * as api from '../api';

interface Message {
  id: string;
  type: 'question' | 'answer';
  content: string;
  confidence?: number;
  timestamp: Date;
}

interface ChatInterfaceProps {
  conferenceId: string;
  shouldStartTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ conferenceId, shouldStartTyping }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConferenceReady, setIsConferenceReady] = useState(false);

  useEffect(() => {
    if (shouldStartTyping) {
      setIsConferenceReady(true);
      // Добавляем приветственное сообщение
      setMessages([{
        id: '1',
        type: 'answer',
        content: 'Конференция обработана! Теперь вы можете задавать вопросы по её содержанию.',
        timestamp: new Date()
      }]);
    }
  }, [shouldStartTyping]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) return;

    const questionMessage: Message = {
      id: Date.now().toString(),
      type: 'question',
      content: question.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, questionMessage]);
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.askQuestion(conferenceId, questionMessage.content);
      
      const answerMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: response.answer,
        confidence: response.confidence,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, answerMessage]);
    } catch (err) {
      console.error('Ошибка при отправке вопроса:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка: ${err.message}`);
      } else {
        setError('Не удалось получить ответ на вопрос');
      }
    } finally {
      setIsLoading(false);
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
        borderRadius: 8,
        backgroundColor: 'background.paper'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 500,
          mb: 3
        }}
      >
        Вопросы по конференции
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        overflowY: 'auto',
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 8,
        position: 'relative',
        height: '400px',
        maxHeight: '400px',
        mb: 2,
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
        {!isConferenceReady ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Ожидание завершения обработки...
            </Typography>
            <Typography variant="body2">
              После завершения обработки здесь можно будет задавать вопросы
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 8,
                    backgroundColor: message.type === 'question' 
                      ? 'primary.main' 
                      : 'background.paper',
                    color: message.type === 'question' 
                      ? 'primary.contrastText' 
                      : 'text.primary',
                    alignSelf: message.type === 'question' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    boxShadow: 1
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {message.content}
                  </Typography>
                  {message.confidence && (
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Уверенность: {Math.round(message.confidence * 100)}%
                    </Typography>
                  )}
                </Box>
              </motion.div>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Обрабатываю вопрос...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmitQuestion}>
        <TextField
          fullWidth
          placeholder={isConferenceReady ? "Задайте вопрос по конференции..." : "Ожидание обработки..."}
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={!isConferenceReady || isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  type="submit"
                  disabled={!question.trim() || !isConferenceReady || isLoading}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <SendIcon />
                </Button>
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
        />
      </Box>
    </Paper>
  );
}; 