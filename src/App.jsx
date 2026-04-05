import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import WorldsPage from './pages/WorldsPage'
import WorldRoomPage from './pages/WorldRoomPage'
import AvatarsPage from './pages/AvatarsPage'
import ProtectedRoute from './components/ProtectedRoute'
import AiChatPage from './pages/AiChatPage'
import MonitorPage from './pages/MonitorPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/ai-chat" element={
            <ProtectedRoute><AiChatPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/worlds" element={
          <ProtectedRoute><WorldsPage /></ProtectedRoute>
        } />
        <Route path="/worlds/:worldId/room" element={
          <ProtectedRoute><WorldRoomPage /></ProtectedRoute>
        } />
        <Route path="/avatars" element={
          <ProtectedRoute><AvatarsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/monitor" element={
          <ProtectedRoute><MonitorPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
