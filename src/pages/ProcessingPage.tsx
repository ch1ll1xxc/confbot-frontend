import React from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Header } from '../components/Header';
import ProcessingSteps from '../components/ProcessingSteps';
import ChatInterface from '../components/ChatInterface';
import FileProcessing from '../components/FileProcessing';
import { useLocation, useNavigate } from 'react-router-dom';

const ProcessingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location.state?.status || 'queued';

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ 
            mr: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 120, 75, 0.1)'
            }
          }}
        >
          <HomeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </IconButton>
        <Header />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <ProcessingSteps initialStatus={status} />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChatInterface />
        </Grid>
        <Grid item xs={12} md={4}>
          <FileProcessing />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessingPage; 