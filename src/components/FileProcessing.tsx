import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button, Menu, MenuItem } from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AudioSample {
  id: string;
  duration: number;
  speaker: string;
  isPlaying: boolean;
  progress: number;
}

const FileProcessing: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [samples, setSamples] = useState<AudioSample[]>([
    { id: '1', duration: 30, speaker: '', isPlaying: false, progress: 0 },
    { id: '2', duration: 45, speaker: '', isPlaying: false, progress: 0 },
    { id: '3', duration: 60, speaker: '', isPlaying: false, progress: 0 }
  ]);
  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

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
    setSamples(prev => prev.map(sample => {
      if (sample.id === id) {
        const isPlaying = !sample.isPlaying;
        
        if (isPlaying) {
          // Очищаем предыдущий интервал, если он существует
          if (intervalsRef.current[id]) {
            clearInterval(intervalsRef.current[id]);
          }
          
          // Создаем новый интервал
          intervalsRef.current[id] = setInterval(() => {
            setSamples(current => current.map(s => {
              if (s.id === id) {
                const newProgress = s.progress + (100 / (s.duration * 10));
                if (newProgress >= 100) {
                  clearInterval(intervalsRef.current[id]);
                  return { ...s, isPlaying: false, progress: 0 };
                }
                return { ...s, progress: newProgress };
              }
              return s;
            }));
          }, 100);
        } else {
          // Останавливаем интервал при паузе
          if (intervalsRef.current[id]) {
            clearInterval(intervalsRef.current[id]);
          }
        }
        
        return { ...sample, isPlaying };
      }
      return sample;
    }));
  };

  // Очистка интервалов при размонтировании компонента
  React.useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {/* Исходный файл */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Исходный файл
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>conference_recording.mp3</Typography>
          <IconButton color="primary">
            <PlayIcon />
          </IconButton>
          <IconButton color="primary">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Итоговый файл */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Итоговый файл
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Конференция по ИИ</Typography>
          <Button
            endIcon={<ArrowDownIcon />}
            onClick={handleFormatClick}
            variant="outlined"
          >
            {selectedFormat || 'Выберите формат'}
          </Button>
          <IconButton color="primary">
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
                borderRadius: 1
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 40,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  animate={{
                    width: `${sample.progress}%`,
                    backgroundColor: '#00784B'
                  }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    height: '100%',
                    left: 0,
                    top: 0
                  }}
                />
                <IconButton
                  sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => handlePlayPause(sample.id)}
                >
                  {sample.isPlaying ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </Box>
              <TextField
                placeholder={`Участник_${sample.id}`}
                value={sample.speaker}
                onChange={(e) => handleSpeakerSubmit(sample.id, e.target.value)}
                size="small"
                sx={{ width: 200 }}
              />
              <IconButton 
                color="success" 
                onClick={() => handleSpeakerSubmit(sample.id, sample.speaker)}
                disabled={!sample.speaker.trim()}
              >
                <CheckIcon />
              </IconButton>
              <IconButton 
                color="error" 
                onClick={() => handleSpeakerSubmit(sample.id, '')}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default FileProcessing; 