import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Alert, CircularProgress } from '@mui/material';
import { Header } from '../components/Header';
import { ProcessingSteps } from '../components/ProcessingSteps';
import { ChatInterface } from '../components/ChatInterface';
import FileProcessing from '../components/FileProcessing';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../api';

const ProcessingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const conferenceId = location.state?.conferenceId;
  
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const [conference, setConference] = useState<api.Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConference = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const conferenceData = await api.getConference(conferenceId);
      setConference(conferenceData);
    } catch (err) {
      console.error('Ошибка загрузки конференции:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка загрузки: ${err.message}`);
      } else {
        setError('Не удалось загрузить конференцию');
      }
    } finally {
      setLoading(false);
    }
  }, [conferenceId]);

  useEffect(() => {
    if (!conferenceId) {
      navigate('/');
      return;
    }
    
    loadConference();
  }, [conferenceId, navigate, loadConference]);

  const handleTranscriptionComplete = () => {
    setShouldStartTyping(true);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
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

  if (error || !conference) {
    return (
      <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
        <Header />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Конференция не найдена'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <ProcessingSteps 
            conferenceId={conferenceId}
            initialStatus={conference.status} 
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChatInterface 
            conferenceId={conferenceId}
            shouldStartTyping={shouldStartTyping} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FileProcessing 
            conferenceId={conferenceId}
            conference={conference}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessingPage; 