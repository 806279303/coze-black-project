import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import ParticleBackground from '../components/ParticleBackground'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const success = await login(username, password)
    if (success) {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-void relative overflow-hidden flex items-center justify-center">
      {/* 动态背景 */}
      <ParticleBackground />
      
      {/* 网格 */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* 登录卡片 */}
      <motion.div
        className="relative z-10 w-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl 
                        bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10
                        border border-white/10 flex items-center justify-center
                        shadow-lg shadow-accent-cyan/5">
            <span className="text-2xl text-gradient-accent font-extralight">V</span>
          </div>
          <h1 className="text-2xl font-extralight tracking-[0.2em] text-gradient mb-2">
            直播运营系统
          </h1>
          <p className="text-white/30 text-sm font-light tracking-wider">
            内部协作平台
          </p>
        </motion.div>

        {/* 表单 */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="space-y-8">
            {/* 用户名 */}
            <div className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                className="input-line text-white/80 placeholder:text-white/20"
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="input-line text-white/80 placeholder:text-white/20"
              />
            </div>
          </div>

          {/* 登录按钮 */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full mt-10 btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-accent-cyan rounded-full animate-spin" />
            ) : (
              '进入'
            )}
          </motion.button>

          {/* 底部链接 */}
          <p className="text-center mt-6 text-white/20 text-sm font-light">
            忘记密码？
          </p>
        </motion.form>

        {/* 版本信息 */}
        <motion.p
          className="text-center mt-8 text-white/10 text-xs font-light tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          v0.1.0 by 小v
        </motion.p>
      </motion.div>
    </div>
  )
}
