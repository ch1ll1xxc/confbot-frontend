import React from 'react';
import { Box, Grid } from '@mui/material';
import { Header } from '../components/Header';
import ProcessingSteps from '../components/ProcessingSteps';
import { ChatInterface } from '../components/ChatInterface';
import FileProcessing from '../components/FileProcessing';
import { useLocation } from 'react-router-dom';

const ProcessingPage: React.FC = () => {
  const location = useLocation();
  const status = location.state?.status || 'queued';

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <Header />
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