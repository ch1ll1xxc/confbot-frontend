import React from 'react';
import { Card, CardContent, IconButton, Typography, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ConferenceCardProps {
  name: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'pending' | 'queued';
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const statusColors = {
  processed: '#4CAF50',
  processing: '#FFC107',
  pending: '#FF9800',
  queued: '#2196F3'
};

const statusText = {
  processed: 'Обработано',
  processing: 'В обработке',
  pending: 'Ожидает',
  queued: 'В очереди'
};

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  name,
  uploadDate,
  status,
  onEdit,
  onDelete,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          minWidth: 275,
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Загружено: {uploadDate}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  backgroundColor: statusColors[status],
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 8,
                  mr: 2
                }}
              >
                {statusText[status]}
              </Box>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }} 
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }} 
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 