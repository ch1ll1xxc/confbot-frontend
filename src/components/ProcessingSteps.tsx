import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  CheckCircle as CompletedIcon,
  Error as ErrorIcon,
  HourglassEmpty as WaitingIcon,
  Autorenew as ProcessingIcon
} from '@mui/icons-material';

type StepStatus = 'waiting' | 'error' | 'processing' | 'completed';

interface ProcessingStep {
  name: string;
  status: StepStatus;
}

interface ProcessingStepsProps {
  initialStatus?: 'processed' | 'processing' | 'queued';
}

const statusIcons = {
  waiting: WaitingIcon,
  error: ErrorIcon,
  processing: ProcessingIcon,
  completed: CompletedIcon
};

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
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: 3
      }}
    >
      <Typography variant="h6" gutterBottom>
        Этапы обработки
      </Typography>
      {steps.map((step, index) => {
        const StatusIcon = statusIcons[step.status];
        return (
          <Box
            key={step.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              position: 'relative'
            }}
          >
            <StatusIcon sx={{ color: statusColors[step.status] }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">{step.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {step.status === 'waiting' && 'Ожидание'}
                {step.status === 'processing' && 'В процессе'}
                {step.status === 'completed' && 'Завершено'}
                {step.status === 'error' && 'Ошибка'}
              </Typography>
            </Box>
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
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: statusColors[step.status],
                  position: 'absolute',
                  right: 12
                }}
              />
            )}
          </Box>
        );
      })}
    </Paper>
  );
};
export default ProcessingSteps;
