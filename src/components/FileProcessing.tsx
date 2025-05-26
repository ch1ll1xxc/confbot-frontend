import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button, Menu, MenuItem, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Check as CheckIcon,

  KeyboardArrowDown as ArrowDownIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import * as api from '../api';

interface FileProcessingProps {
  conferenceId: string;
  conference: api.Conference;
}

const FileProcessing: React.FC<FileProcessingProps> = ({ conferenceId, conference }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [samples, setSamples] = useState<api.Sample[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const loadSamples = useCallback(async () => {
    try {
      setLoading(true);
      const samplesData = await api.getSamples(conferenceId);
      setSamples(samplesData);
    } catch (err) {
      console.error('Ошибка загрузки samples:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка загрузки samples: ${err.message}`);
      } else {
        setError('Не удалось загрузить аудио фрагменты');
      }
    } finally {
      setLoading(false);
    }
  }, [conferenceId]);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

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

  const handleSpeakerUpdate = async (sampleId: string, speakerName: string) => {
    try {
      await api.setSampleSpeaker(conferenceId, sampleId, speakerName);
      setSamples(prev => prev.map(sample => 
        sample.id === sampleId ? { ...sample, speaker_name: speakerName } : sample
      ));
    } catch (err) {
      console.error('Ошибка обновления спикера:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка обновления: ${err.message}`);
      } else {
        setError('Не удалось обновить имя спикера');
      }
    }
  };

  const handleSpeakerClear = async (sampleId: string) => {
    try {
      await api.resetSampleSpeaker(conferenceId, sampleId);
      setSamples(prev => prev.map(sample => 
        sample.id === sampleId ? { ...sample, speaker_name: '' } : sample
      ));
    } catch (err) {
      console.error('Ошибка сброса спикера:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка сброса: ${err.message}`);
      } else {
        setError('Не удалось сбросить имя спикера');
      }
    }
  };

  const handlePlayPause = async (sampleId: string) => {
    try {
      if (playingSampleId === sampleId && currentAudio) {
        // Пауза текущего аудио
        currentAudio.pause();
        setPlayingSampleId(null);
        setCurrentAudio(null);
        return;
      }

      // Останавливаем предыдущее аудио
      if (currentAudio) {
        currentAudio.pause();
      }

      // Получаем аудио для sample
      const audioBlob = await api.getSampleAudio(conferenceId, sampleId);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingSampleId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.play();
      setCurrentAudio(audio);
      setPlayingSampleId(sampleId);
    } catch (err) {
      console.error('Ошибка воспроизведения:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка воспроизведения: ${err.message}`);
      } else {
        setError('Не удалось воспроизвести аудио');
      }
    }
  };

  const handlePlayMainAudio = async () => {
    try {
      if (isPlaying && currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
        setCurrentAudio(null);
        return;
      }

      const audioBlob = await api.getConferenceAudio(conferenceId);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
    } catch (err) {
      console.error('Ошибка воспроизведения основного аудио:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка воспроизведения: ${err.message}`);
      } else {
        setError('Не удалось воспроизвести аудио');
      }
    }
  };

  const handleDownloadMainAudio = async () => {
    try {
      const audioBlob = await api.getConferenceAudio(conferenceId);
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conference.name}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка скачивания аудио:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка скачивания: ${err.message}`);
      } else {
        setError('Не удалось скачать аудио');
      }
    }
  };

  const handleDownloadReport = async () => {
    if (!selectedFormat) {
      setError('Выберите формат отчета');
      return;
    }

    try {
      setDownloadingReport(true);
      const format = selectedFormat.toLowerCase() as 'pdf' | 'docx' | 'txt';
      const reportBlob = await api.getReport(conferenceId, format);
      
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conference.name}_report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка скачивания отчета:', err);
      if (err instanceof api.ApiError) {
        setError(`Ошибка скачивания отчета: ${err.message}`);
      } else {
        setError('Не удалось скачать отчет');
      }
    } finally {
      setDownloadingReport(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Информация о файле
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Название: {conference.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Статус: {conference.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создано: {new Date(conference.created_at).toLocaleDateString('ru-RU')}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          mt: 2
        }}>
          <Button
            variant="outlined"
            startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={handlePlayMainAudio}
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
            onClick={handleDownloadMainAudio}
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
          Итоговый отчет
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          position: 'relative',
          pr: 6
        }}>
          <Typography>{conference.name}</Typography>
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
            onClick={handleDownloadReport}
            disabled={!selectedFormat || downloadingReport}
            sx={{ 
              position: 'absolute',
              right: 0
            }}
          >
            {downloadingReport ? <CircularProgress size={24} /> : <DownloadIcon />}
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
          Аудио фрагменты
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : samples.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Аудио фрагменты не найдены
          </Typography>
        ) : (
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
                  {playingSampleId === sample.id ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDuration(sample.start_time)} - {formatDuration(sample.end_time)}
                  </Typography>
                  <TextField
                    placeholder={sample.speaker_name || `Участник_${sample.id.slice(-4)}`}
                    value={sample.speaker_name}
                    onChange={(e) => {
                      setSamples(prev => prev.map(s => 
                        s.id === sample.id ? { ...s, speaker_name: e.target.value } : s
                      ));
                    }}
                    size="small"
                    sx={{ 
                      width: 200,
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 8 
                      }
                    }}
                    InputProps={{
                      endAdornment: sample.speaker_name && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleSpeakerClear(sample.id)}
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
                </Box>
                <IconButton 
                  color="success" 
                  onClick={() => handleSpeakerUpdate(sample.id, sample.speaker_name)}
                  disabled={!sample.speaker_name?.trim()}
                  sx={{ 
                    borderRadius: 8
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FileProcessing; 