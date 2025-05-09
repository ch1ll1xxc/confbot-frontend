import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

type StepStatus = 'waiting' | 'error' | 'processing' | 'completed';

interface ProcessingStep {
  name: string;
  status: StepStatus;
}

interface ProcessingStepsProps {
  initialStatus?: 'processed' | 'processing' | 'queued';
}

const statusColors = {
  waiting: '#2196F3',
  error: '#f44336',
  processing: '#FFC107',
  completed: '#4CAF50'
};

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ initialStatus = 'queued' }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { name: 'TTS', status: 'waiting' },
    { name: 'LLM_1', status: 'waiting' },
    { name: 'LLM_2', status: 'waiting' },
    { name: 'Подведение итогов', status: 'waiting' }
  ]);

  useEffect(() => {
    if (initialStatus === 'processed') {
      setSteps(steps.map(step => ({ ...step, status: 'completed' })));
    } else if (initialStatus === 'queued') {
      // Анимация последовательного выполнения шагов
      const delays = [2000, 4000, 6000, 7000];
      steps.forEach((_, index) => {
        setTimeout(() => {
          setSteps(prev => prev.map((step, i) => {
            if (i === index) {
              return { ...step, status: 'completed' };
            } else if (i === index + 1) {
              return { ...step, status: 'processing' };
            }
            return step;
          }));
        }, delays[index]);
      });
    } else if (initialStatus === 'processing') {
      // Находим первый шаг со статусом 'waiting' и делаем его 'processing'
      const firstWaitingIndex = steps.findIndex(step => step.status === 'waiting');
      if (firstWaitingIndex !== -1) {
        setSteps(prev => prev.map((step, i) => 
          i === firstWaitingIndex ? { ...step, status: 'processing' } : step
        ));
      }
    }
  }, [initialStatus]);

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
      <Typography variant="h6" gutterBottom>
        Этапы обработки
      </Typography>
      {steps.map((step, index) => (
        <Box
          key={step.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: statusColors[step.status],
            color: 'white',
            position: 'relative'
          }}
        >
          <Typography>{step.name}</Typography>
          {step.status === 'processing' && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'white',
                position: 'absolute',
                right: 16
              }}
            />
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default ProcessingSteps;