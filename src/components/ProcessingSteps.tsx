import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { CheckCircle as CheckIcon, RadioButtonUnchecked as UncheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../api';

interface ProcessingStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  progress?: number;
}

interface ProcessingStepsProps {
  conferenceId: string;
  initialStatus: string;
  onTranscriptionComplete: () => void;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ 
  conferenceId, 
  initialStatus, 
  onTranscriptionComplete 
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', title: 'Загрузка файла', status: 'completed' },
    { id: '2', title: 'Обработка аудио', status: 'pending' },
    { id: '3', title: 'Транскрибация', status: 'pending' },
    { id: '4', title: 'Анализ текста', status: 'pending' },
    { id: '5', title: 'Формирование отчета', status: 'pending' }
  ]);

  const [currentProgress, setCurrentProgress] = useState(0);

  const updateStepsFromStatus = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === 0 ? 'completed' : 'pending'
        })));
        break;
      case 'processing':
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === 0 ? 'completed' : index === 1 ? 'processing' : 'pending'
        })));
        break;
      case 'processed':
        setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
        onTranscriptionComplete();
        break;
    }
  }, [onTranscriptionComplete]);

  const startStatusPolling = useCallback(() => {
    const pollStatus = async () => {
      try {
        const statusData = await api.getConferenceStatus(conferenceId);
        
        // Обновляем прогресс
        setCurrentProgress(statusData.progress);
        
        // Обновляем этапы на основе данных API
        if (statusData.stages) {
          setSteps(prev => prev.map((step, index) => {
            const apiStage = statusData.stages[index];
            if (apiStage) {
              return {
                ...step,
                status: apiStage.status === 'completed' ? 'completed' : 
                       apiStage.status === 'processing' ? 'processing' : 'pending',
                progress: apiStage.progress
              };
            }
            return step;
          }));
        }

        // Если обработка завершена, останавливаем polling
        if (statusData.status === 'completed') {
          onTranscriptionComplete();
          return;
        }

        // Продолжаем polling через 3 секунды
        setTimeout(pollStatus, 3000);
      } catch (error) {
        console.error('Ошибка получения статуса:', error);
        // В случае ошибки повторяем через 5 секунд
        setTimeout(pollStatus, 5000);
      }
    };

    pollStatus();
  }, [conferenceId, onTranscriptionComplete]);

  useEffect(() => {
    // Инициализируем статус на основе данных конференции
    updateStepsFromStatus(initialStatus);
    
    // Если конференция еще обрабатывается, запускаем polling
    if (initialStatus === 'processing' || initialStatus === 'pending') {
      startStatusPolling();
    }
  }, [conferenceId, initialStatus, updateStepsFromStatus, startStatusPolling]);

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
                  variant={step.progress ? 'determinate' : 'indeterminate'}
                  value={step.progress || currentProgress}
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
