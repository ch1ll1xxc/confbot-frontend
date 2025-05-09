import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button, Menu, MenuItem, InputAdornment } from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AudioSample {
  id: string;
  duration: number;
  speaker: string;
  isPlaying: boolean;
}

const FileProcessing: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [samples, setSamples] = useState<AudioSample[]>([
    { id: '1', duration: 30, speaker: '', isPlaying: false },
    { id: '2', duration: 45, speaker: '', isPlaying: false },
    { id: '3', duration: 60, speaker: '', isPlaying: false }
  ]);
  const [participantName, setParticipantName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFormatClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFormatClose = () => {
    setAnchorEl(null);
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    handleFormatClose();
  };

  const handleSpeakerSubmit = (id: string, name: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === id ? { ...sample, speaker: name } : sample
    ));
  };

  const handlePlayPause = (id: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === id ? { ...sample, isPlaying: !sample.isPlaying } : sample
    ));
  };

  const handlePlaySample = () => {
    setIsPlaying(!isPlaying);
    // Здесь будет логика воспроизведения аудио
  };

  const handleDownload = () => {
    // Здесь будет логика скачивания файла
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        borderRadius: 8
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Информация о файле
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Название файла: conference_audio.mp3
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Размер: 15.4 MB
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button
            variant="outlined"
            startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={handlePlaySample}
            sx={{ 
              borderRadius: 8,
              textTransform: 'none',
              minWidth: 120
            }}
          >
            {isPlaying ? 'Пауза' : 'Слушать'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ 
              borderRadius: 8,
              textTransform: 'none',
              minWidth: 120
            }}
          >
            Скачать
          </Button>
        </Box>
      </Box>

      {/* Итоговый файл */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Итоговый файл
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          position: 'relative',
          pr: 6
        }}>
          <Typography>Конференция по ИИ</Typography>
          <Button
            endIcon={<ArrowDownIcon />}
            onClick={handleFormatClick}
            variant="outlined"
            sx={{ 
              borderRadius: 8,
              minWidth: 150
            }}
          >
            {selectedFormat || 'Выбрать формат'}
          </Button>
          <IconButton 
            color="primary"
            sx={{ 
              position: 'absolute',
              right: 0
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFormatClose}
        >
          <MenuItem onClick={() => handleFormatSelect('PDF')}>PDF</MenuItem>
          <MenuItem onClick={() => handleFormatSelect('DOCX')}>DOCX</MenuItem>
          <MenuItem onClick={() => handleFormatSelect('TXT')}>TXT</MenuItem>
        </Menu>
      </Box>

      {/* Аудио сэмплы */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Аудио сэмплы
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {samples.map((sample) => (
            <Box
              key={sample.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                position: 'relative'
              }}
            >
              <IconButton
                onClick={() => handlePlayPause(sample.id)}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 120, 75, 0.1)'
                  }
                }}
              >
                {sample.isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <TextField
                placeholder={`Участник_${sample.id}`}
                value={sample.speaker}
                onChange={(e) => handleSpeakerSubmit(sample.id, e.target.value)}
                size="small"
                sx={{ 
                  width: 200,
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 8 
                  }
                }}
                InputProps={{
                  endAdornment: sample.speaker && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleSpeakerSubmit(sample.id, '')}
                        edge="end"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main'
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <IconButton 
                color="success" 
                onClick={() => handleSpeakerSubmit(sample.id, sample.speaker)}
                disabled={!sample.speaker.trim()}
                sx={{ 
                  borderRadius: 8,
                  position: 'absolute',
                  right: 16
                }}
              >
                <CheckIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default FileProcessing; 