import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';

interface AddConferenceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, file: File) => void;
}

export const AddConferenceModal: React.FC<AddConferenceModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (name && file) {
      onSubmit(name, file);
      setName('');
      setFile(null);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 8 }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        color: 'primary.main',
        fontWeight: 500,
        fontSize: '1.5rem'
      }}>
        Добавить конференцию
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Название конференции"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 8 
              }
            }}
          />
          
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 4,
              border: '2px dashed',
              borderColor: isDragging ? 'primary.main' : 'divider',
              borderRadius: 8,
              backgroundColor: isDragging ? 'rgba(0, 120, 75, 0.05)' : 'transparent',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Typography variant="body1" gutterBottom>
              {file ? file.name : 'Перетащите файл сюда или'}
            </Typography>
            <Button 
              variant="outlined" 
              component="label"
              sx={{ 
                borderRadius: 8,
                mt: 1
              }}
            >
              Выберите файл
              <input 
                type="file" 
                hidden 
                onChange={handleFileSelect}
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!name || !file}
          sx={{ 
            minWidth: 200,
            borderRadius: 8
          }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 