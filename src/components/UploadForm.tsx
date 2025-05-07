// src/components/UploadForm.tsx
import { useState } from "react"
import "../styles/UploadForm.css"

export function UploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) onUpload(file)
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label className="upload-label">Загрузите файл (.mp3 или .mp4)</label>
      <div className="upload-input-container">
        <input
          type="file"
          accept=".mp3,.mp4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input"
        />
        <button
          type="submit"
          disabled={!file}
          className="upload-button"
        >
          📥 Отправить
        </button>
      </div>
    </form>
  )
}
