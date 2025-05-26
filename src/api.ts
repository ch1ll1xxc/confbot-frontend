const API_URL = '/api/v1';

// Типы данных согласно API документации
export interface Conference {
  id: string;
  name: string;
  tags: string[];
  audio_url: string;
  status: 'processed' | 'processing' | 'pending' | 'queued';
  created_at: string;
  updated_at?: string;
  samples?: Sample[];
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  attached_at?: string;
}

export interface Sample {
  id: string;
  speaker_name: string;
  start_time: number;
  end_time: number;
  audio_url?: string;
}

export interface ProcessingStatus {
  status: 'processing' | 'completed' | 'pending' | 'error';
  progress: number;
  current_stage: string;
  stages: ProcessingStage[];
  estimated_time_remaining?: string;
}

export interface ProcessingStage {
  name: string;
  status: 'completed' | 'processing' | 'pending' | 'error';
  progress: number;
}

export interface ConferencesResponse {
  conferences: Conference[];
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface TagsResponse {
  tags: Tag[];
  meta: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface QueueResponse {
  queue: string[];
  processing_now?: string;
}

export interface QueuePosition {
  position: number;
  estimated_wait_time: string;
}

export interface QuestionResponse {
  answer: string;
  confidence: number;
}

// Обработка ошибок API
export class ApiError extends Error {
  public status: number;
  public error: string;
  public details?: unknown;

  constructor(
    status: number,
    error: string,
    details?: unknown
  ) {
    super(error);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      error: 'unknown_error', 
      message: 'Неизвестная ошибка сервера' 
    }));
    throw new ApiError(response.status, errorData.message || errorData.error, errorData);
  }
  return response.json();
}

async function handleBlobResponse(response: Response): Promise<Blob> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      error: 'unknown_error', 
      message: 'Неизвестная ошибка сервера' 
    }));
    throw new ApiError(response.status, errorData.message || errorData.error, errorData);
  }
  return response.blob();
}

// Конференции
export async function getConferences(params: Record<string, string | number> = {}): Promise<ConferencesResponse> {
  const stringParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
  const query = new URLSearchParams(stringParams).toString();
  const response = await fetch(`${API_URL}/conferences${query ? '?' + query : ''}`);
  return handleResponse<ConferencesResponse>(response);
}

export async function getConference(id: string): Promise<Conference> {
  const response = await fetch(`${API_URL}/conferences/${id}`);
  return handleResponse<Conference>(response);
}

export async function createConference(name: string, file: File, tags?: string[]): Promise<Conference> {
  const form = new FormData();
  form.append('name', name);
  form.append('audio', file);
  if (tags) {
    tags.forEach(tag => form.append('tags[]', tag));
  }
  
  const response = await fetch(`${API_URL}/conferences`, {
    method: 'POST',
    body: form
  });
  return handleResponse<Conference>(response);
}

export async function deleteConference(id: string): Promise<{ message: string; conference_id: string; name: string }> {
  const response = await fetch(`${API_URL}/conferences/${id}`, { 
    method: 'DELETE' 
  });
  return handleResponse(response);
}

// Теги
export async function getTags(params: Record<string, string | number> = {}): Promise<TagsResponse> {
  const stringParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
  const query = new URLSearchParams(stringParams).toString();
  const response = await fetch(`${API_URL}/tags${query ? '?' + query : ''}`);
  return handleResponse<TagsResponse>(response);
}

export async function createTag(name: string, description?: string): Promise<Tag> {
  const response = await fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  });
  return handleResponse<Tag>(response);
}

export async function deleteTag(tagId: string): Promise<{ message: string; tag_id: string; untagged_conferences: Conference[] }> {
  const response = await fetch(`${API_URL}/tags/${tagId}`, { 
    method: 'DELETE' 
  });
  return handleResponse(response);
}

// Работа с тегами конференции
export async function addTagToConference(conferenceId: string, tag: string): Promise<{ conference_id: string; tag_id: string; attached_at: string }> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag })
  });
  return handleResponse(response);
}

export async function removeTagFromConference(conferenceId: string, tagId: string): Promise<{ message: string; conference_id: string; tag_id: string }> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/tags/${tagId}`, { 
    method: 'DELETE' 
  });
  return handleResponse(response);
}

export async function getConferenceTags(conferenceId: string): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/tags`);
  return handleResponse<Tag[]>(response);
}

// Статус обработки
export async function getConferenceStatus(id: string, stage?: string): Promise<ProcessingStatus> {
  const url = stage 
    ? `${API_URL}/conferences/${id}/status?stage=${stage}`
    : `${API_URL}/conferences/${id}/status`;
  const response = await fetch(url);
  return handleResponse<ProcessingStatus>(response);
}

export async function getProcessingQueue(): Promise<QueueResponse> {
  const response = await fetch(`${API_URL}/processing/queue`);
  return handleResponse<QueueResponse>(response);
}

export async function getQueuePosition(conferenceId: string): Promise<QueuePosition> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/queue-position`);
  return handleResponse<QueuePosition>(response);
}

// Аудио и samples
export async function getConferenceAudio(id: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/conferences/${id}/audio`);
  return handleBlobResponse(response);
}

export async function getSamples(conferenceId: string): Promise<Sample[]> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/samples`);
  return handleResponse<Sample[]>(response);
}

export async function getSampleAudio(conferenceId: string, sampleId: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/samples/${sampleId}/audio`);
  return handleBlobResponse(response);
}

export async function setSampleSpeaker(conferenceId: string, sampleId: string, speaker_name: string): Promise<{ id: string; speaker_name: string; updated_at: string }> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/samples/${sampleId}/speaker`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speaker_name })
  });
  return handleResponse(response);
}

export async function resetSampleSpeaker(conferenceId: string, sampleId: string): Promise<{ message: string; sample_id: string }> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/samples/${sampleId}/speaker`, {
    method: 'DELETE' 
  });
  return handleResponse(response);
}

// Отчёты
export async function getReport(conferenceId: string, format: 'pdf' | 'docx' | 'txt'): Promise<Blob> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/report/${format}`);
  return handleBlobResponse(response);
}

// Вопросы по содержанию
export async function askQuestion(conferenceId: string, question: string): Promise<QuestionResponse> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  return handleResponse<QuestionResponse>(response);
}

// Перезапуск обработки
export async function reprocessConference(conferenceId: string, fromStage: string): Promise<{ status: string; restarted_from: string }> {
  const response = await fetch(`${API_URL}/conferences/${conferenceId}/reprocess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from_stage: fromStage })
  });
  return handleResponse(response);
}

// Системные endpoints
export async function ping(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch('/ping');
  return handleResponse(response);
}

export async function getInfo(): Promise<{ name: string; version: string; status: string; services: Record<string, string> }> {
  const response = await fetch('/info');
  return handleResponse(response);
}

// Получение этапов обработки
export async function getProcessingStages(): Promise<ProcessingStage[]> {
  const response = await fetch(`${API_URL}/processing/stages`);
  return handleResponse(response);
}

export async function getProcessingStage(stageId: string): Promise<ProcessingStage> {
  const response = await fetch(`${API_URL}/processing/stages/${stageId}`);
  return handleResponse(response);
} 