import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import AITools from './pages/AITools'
import WatermarkRemover from './pages/WatermarkRemover'
import TitleGenerator from './pages/TitleGenerator'
import EditorWorkspace from './pages/EditorWorkspace'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          
          <Route path="/" element={
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }>
            <Route index element={<Navigate to="/ai-tools" replace />} />
            <Route path="ai-tools" element={<AITools />} />
            <Route path="watermark" element={<WatermarkRemover />} />
            <Route path="title-generator" element={<TitleGenerator />} />
            <Route path="editor" element={<EditorWorkspace />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
