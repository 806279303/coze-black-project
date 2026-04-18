import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/auth'
import { LogOut, Bell } from 'lucide-react'

export default function TopBar() {
  const { user, logout } = useAuthStore()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 z-30
                 bg-void/50 backdrop-blur-xl border-b border-white/5"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 
                      flex items-center justify-center border border-white/10">
          <span className="text-accent-cyan text-sm font-light">V</span>
        </div>
        <span className="text-white/60 text-sm font-light tracking-widest">
          直播运营系统
        </span>
      </div>

      {/* 用户信息 */}
      <div className="flex items-center gap-6">
        {/* 通知 */}
        <button className="relative text-white/40 hover:text-white/70 transition-colors">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-cyan rounded-full" />
        </button>

        {/* 用户 */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/80 text-sm font-light">{user?.realName || '用户'}</p>
            <p className="text-white/30 text-xs">管理员</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-cyan/30
                        flex items-center justify-center border border-white/10">
            <span className="text-white/80 text-sm">{user?.realName?.[0] || 'V'}</span>
          </div>
        </div>

        {/* 登出 */}
        <button 
          onClick={logout}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
        </button>
      </div>
    </motion.header>
  )
}
