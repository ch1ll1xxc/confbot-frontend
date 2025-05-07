// src/pages/MainPage.tsx
import { useState } from "react"
import { UploadForm } from "../components/UploadForm"
import { HistorySidebar } from "../components/HistorySidebar"
import "../styles/MainPage.css"

export default function MainPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const handleUpload = (file: File) => {
    console.log("Загружен файл:", file.name)
    // Тут потом будет API-запрос
  }

  return (
    <div className="main-page">
      <div className="main-container">
        <h1 className="main-title">🎙️ Конференц-бот</h1>
        <UploadForm onUpload={handleUpload} />
        <div className="text-center mt-6">
            <button
            onClick={() => setSidebarOpen(true)}
            className="chat-button"
          >
            📝 Задать вопрос
          </button>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="history-button"
          >
            📚 Посмотреть историю записей
          </button>
        </div>
        
        </div>
      <HistorySidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
