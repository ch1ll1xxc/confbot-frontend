// src/pages/MainPage.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { ConferenceCard } from '../components/ConferenceCard';
import { AddConferenceModal } from '../components/AddConferenceModal';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

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
            {conferences.map((conference) => (
              <motion.div
                key={conference.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ConferenceCard
                  name={conference.name}
                  uploadDate={conference.uploadDate}
                  status={conference.status}
                  onEdit={() => handleEdit(conference.id)}
                  onDelete={() => handleDelete(conference.id)}
                  onClick={() => handleConferenceClick(conference)}
                />
              </motion.div>
            ))}
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
