import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ParticleBackground from './ParticleBackground'

export default function Layout() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* 动态背景 */}
      <ParticleBackground />
      
      {/* 网格背景 */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      
      {/* 顶部导航 */}
      <TopBar />
      
      {/* 主内容区 */}
      <div className="flex pt-16">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 内容区 */}
        <motion.main 
          className="flex-1 ml-20 p-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
