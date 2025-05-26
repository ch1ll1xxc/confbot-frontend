// src/pages/MainPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ConferenceCard } from '../components/ConferenceCard';
import { AddConferenceModal } from '../components/AddConferenceModal';

import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';
import * as api from '../api';

export const MainPage: React.FC = () => {
  const [conferences, setConferences] = useState<api.Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Загрузка конференций при монтировании компонента
  useEffect(() => {
    loadConferences();
  }, []);

  const loadConferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getConferences();
      setConferences(response.conferences);
    } catch (err) {
      console.error('Ошибка загрузки конференций:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка загрузки: ${err.message}`);
      } else {
        setError('Не удалось загрузить конференции');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddConference = async (name: string, file: File) => {
    try {
      setError(null);
      const newConference = await api.createConference(name, file);
      setConferences([newConference, ...conferences]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка создания конференции:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка создания: ${err.message}`);
      } else {
        setError('Не удалось создать конференцию');
      }
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit conference:', id);
    // TODO: Реализовать редактирование
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await api.deleteConference(id);
      setConferences(conferences.filter(conf => conf.id !== id));
    } catch (err) {
      console.error('Ошибка удаления конференции:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка удаления: ${err.message}`);
      } else {
        setError('Не удалось удалить конференцию');
      }
    }
  };

  const handleConferenceClick = (conference: api.Conference) => {
    navigate('/processing', { state: { conferenceId: conference.id, status: conference.status } });
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
        <Header />
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Header />
      
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%',
            p: 3,
            mb: 3,
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            borderRadius: 8,
            '& .MuiCard-root': {
              minWidth: '100%',
              mb: 4,
              borderRadius: 8,
              '&:last-child': {
                mb: 0
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {conferences.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Конференции не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Добавьте первую конференцию, нажав кнопку ниже
                </Typography>
              </Box>
            ) : (
              conferences.map((conference) => (
                <motion.div
                  key={conference.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConferenceCard
                    name={conference.name}
                    uploadDate={formatDate(conference.created_at)}
                    status={conference.status}
                    onEdit={() => handleEdit(conference.id)}
                    onDelete={() => handleDelete(conference.id)}
                    onClick={() => handleConferenceClick(conference)}
                  />
                </motion.div>
              ))
            )}
          </Box>
        </Paper>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          size="large"
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 8,
            textTransform: 'none',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          Добавить конференцию
        </Button>
      </Box>

      <AddConferenceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddConference}
      />
    </Box>
  );
};
