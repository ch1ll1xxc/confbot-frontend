import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { CheckCircle as CheckIcon, RadioButtonUnchecked as UncheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
}

interface ProcessingStepsProps {
  initialStatus: string;
  onTranscriptionComplete: () => void;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ initialStatus, onTranscriptionComplete }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', title: 'Загрузка файла', status: 'completed' },
    { id: '2', title: 'Обработка аудио', status: 'processing' },
    { id: '3', title: 'Транскрибация', status: 'pending' },
    { id: '4', title: 'Анализ текста', status: 'pending' },
    { id: '5', title: 'Формирование отчета', status: 'pending' }
  ]);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 1; i < steps.length; i++) {
        // Устанавливаем текущий этап в processing
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'processing' } : step
        ));

        // Случайная задержка от 4 до 9 секунд
        const delay = Math.floor(Math.random() * (9000 - 4000 + 1)) + 4000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Завершаем текущий этап
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' } : step
        ));

        // Если завершился этап транскрибации, вызываем колбэк
        if (i === 2) { // Индекс 2 соответствует этапу "Транскрибация"
          onTranscriptionComplete();
        }
      }
    };

    processSteps();
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        backgroundColor: 'background.paper',
        height: 'fit-content'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 500
        }}
      >
        Этапы обработки
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {steps.map((step) => (
          <Box
            key={step.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 8,
              position: 'relative'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step.status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {step.status === 'completed' ? (
                  <CheckIcon color="success" />
                ) : (
                  <UncheckIcon color={step.status === 'processing' ? 'primary' : 'disabled'} />
                )}
              </motion.div>
            </AnimatePresence>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {step.title}
              </Typography>
              {step.status === 'processing' && (
                <LinearProgress 
                  sx={{ 
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 120, 75, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main',
                      borderRadius: 2
                    }
                  }} 
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
