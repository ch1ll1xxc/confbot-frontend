// src/components/HistorySidebar.tsx
import "../styles/HistorySidebar.css"

interface HistorySidebarProps {
    isOpen: boolean
    onClose: () => void
  }
  
  export function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
    return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">История файлов</h2>
          <button onClick={onClose} className="close-button">✖</button>
        </div>
        <div className="sidebar-content">
          <ul className="file-list">
            <li className="file-item">📄 meeting_01.mp3</li>
            <li className="file-item">📄 meeting_02.mp4</li>
          </ul>
        </div>
      </div>
    )
  }
  