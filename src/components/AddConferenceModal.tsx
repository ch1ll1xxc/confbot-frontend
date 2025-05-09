import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && file) {
      onSubmit(name, file);
      setName('');
      setFile(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              sx={{
                p: 4,
                width: 500,
                maxWidth: '90vw',
                position: 'relative'
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8
                }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" component="h2" gutterBottom>
                Добавить конференцию
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Наименование файла"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />

                <Box sx={{ mt: 2, mb: 3 }}>
                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      {file ? file.name : 'Выберите файл'}
                    </Button>
                  </label>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!name || !file}
                  >
                    Создать
                  </Button>
                </Box>
              </form>
            </Paper>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}; 