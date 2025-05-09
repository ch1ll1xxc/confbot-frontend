// src/pages/MainPage.tsx
import React, { useState } from 'react';
import { Button, Box, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ConferenceCard } from '../components/ConferenceCard';
import { AddConferenceModal } from '../components/AddConferenceModal';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

interface Conference {
  id: string;
  name: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'queued';
}

export const MainPage: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([
    {
      id: '1',
      name: 'Конференция по ИИ',
      uploadDate: '15.04.2025',
      status: 'processed'
    },
    {
      id: '2',
      name: 'Семинар по машинному обучению',
      uploadDate: '14.04.2025',
      status: 'processing'
    },
    {
      id: '3',
      name: 'Воркшоп по NLP',
      uploadDate: '13.04.2025',
      status: 'queued'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddConference = (name: string, file: File) => {
    const newConference: Conference = {
      id: Date.now().toString(),
      name,
      uploadDate: new Date().toLocaleDateString('ru-RU'),
      status: 'queued'
    };
    setConferences([newConference, ...conferences]);
    setIsModalOpen(false);
  };

  const handleEdit = (id: string) => {
    console.log('Edit conference:', id);
  };

  const handleDelete = (id: string) => {
    setConferences(conferences.filter(conf => conf.id !== id));
  };

  const handleConferenceClick = (conference: Conference) => {
    navigate('/processing', { state: { status: conference.status } });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Header />
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/processing', { state: { status: 'queued' } })}
        >
          Обработать конференцию
        </Button>
      </Box>*/ }

      {/* Основной контент */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Список конференций */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%',
            p: 3,
            mb: 3,
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            '& .MuiCard-root': {
              minWidth: '100%',
              mb: 4,
              '&:last-child': {
                mb: 0
              }
            }
          }}
        >
          <AnimatePresence>
            {conferences.map((conference) => (
              <Box
                key={conference.id}
                onClick={() => handleConferenceClick(conference)}
                sx={{ cursor: conference.status === 'processing' ? 'default' : 'pointer' }}
              >
                <ConferenceCard
                  name={conference.name}
                  uploadDate={conference.uploadDate}
                  status={conference.status}
                  onEdit={() => handleEdit(conference.id)}
                  onDelete={() => handleDelete(conference.id)}
                />
              </Box>
            ))}
          </AnimatePresence>
        </Paper>

        {/* Кнопка добавления */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          size="large"
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Добавить
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
