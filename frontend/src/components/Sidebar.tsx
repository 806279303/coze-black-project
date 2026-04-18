import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { 
  Sparkles, 
  Eraser, 
  FileText,
  Users,
  Clock,
  FolderOpen,
  Settings,
  TrendingUp
} from 'lucide-react'

const menuItems = [
  { path: '/ai-tools', icon: Sparkles, label: 'AI工具箱' },
  { path: '/watermark', icon: Eraser, label: '去水印' },
  { path: '/title-generator', icon: FileText, label: '爆款文案' },
  { path: '/editor', icon: FolderOpen, label: '剪辑工作台' },
  { path: '#', icon: Users, label: '人员管理', disabled: true },
  { path: '#', icon: Clock, label: '考勤管理', disabled: true },
]

export default function Sidebar() {
  return (
    <motion.aside
      className="fixed left-0 top-16 bottom-0 w-20 flex flex-col items-center py-8 z-20"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          item.disabled ? (
            <div
              key={item.label}
              className="w-12 h-12 flex items-center justify-center rounded-xl 
                       text-white/20 cursor-not-allowed"
              title={item.label}
            >
              <item.icon size={20} strokeWidth={1.5} />
            </div>
          ) : (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                w-12 h-12 flex items-center justify-center rounded-xl
                transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-white/10 text-accent-cyan glow-cyan' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }
              `}
            >
              <item.icon size={20} strokeWidth={1.5} />
              
              {/* Tooltip */}
              <span className="absolute left-16 px-3 py-1.5 bg-void-100 border border-white/10 
                            rounded-lg text-xs text-white/80 whitespace-nowrap
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none">
                {item.label}
              </span>
            </NavLink>
          )
        ))}
      </nav>
      
      {/* 底部设置 */}
      <div className="mt-auto">
        <button className="w-12 h-12 flex items-center justify-center rounded-xl
                         text-white/40 hover:text-white/70 hover:bg-white/5
                         transition-all duration-300">
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </div>
    </motion.aside>
  )
}
