import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eraser, FileText, Sparkles, ArrowRight } from 'lucide-react'

const tools = [
  {
    path: '/watermark',
    icon: Eraser,
    title: '智能去水印',
    desc: '一键去除图片水印，支持批量处理',
    status: 'available',
    gradient: 'from-accent-cyan/20 to-accent-cyan/5',
  },
  {
    path: '/title-generator',
    icon: FileText,
    title: '爆款文案生成',
    desc: '自动搜索热门内容，生成爆款标题和文案',
    status: 'available',
    gradient: 'from-accent-purple/20 to-accent-purple/5',
  },
  {
    path: '#',
    icon: Sparkles,
    title: '批量剪辑',
    desc: '一键生成多个短视频版本',
    status: 'coming',
    gradient: 'from-accent-pink/20 to-accent-pink/5',
  },
]

export default function AITools() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* 标题 */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extralight tracking-wider text-gradient mb-3">
          AI工具箱
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          智能化内容创作，提升运营效率
        </p>
      </motion.div>

      {/* 工具卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {tool.status === 'available' ? (
              <Link to={tool.path}>
                <ToolCard tool={tool} />
              </Link>
            ) : (
              <ToolCard tool={tool} />
            )}
          </motion.div>
        ))}
      </div>

      {/* 使用提示 */}
      <motion.div
        className="mt-12 glass rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/40 text-sm font-light">
          💡 提示：所有AI工具需要配置相应的API密钥才能使用，请前往系统设置进行配置
        </p>
      </motion.div>
    </div>
  )
}

interface ToolCardProps {
  tool: typeof tools[0]
}

function ToolCard({ tool }: ToolCardProps) {
  const isDisabled = tool.status === 'coming'
  
  return (
    <div
      className={`
        glass rounded-2xl p-6 h-48 flex flex-col
        transition-all duration-500 group
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-white/[0.05] hover:border-white/20 cursor-pointer'
        }
      `}
    >
      {/* 图标 */}
      <div className={`
        w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient}
        flex items-center justify-center mb-4
        border border-white/10
        ${!isDisabled && 'group-hover:glow-cyan'}
      `}>
        <tool.icon size={22} strokeWidth={1.5} className="text-white/70" />
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-light text-white/80 mb-2 tracking-wide">
        {tool.title}
      </h3>

      {/* 描述 */}
      <p className="text-white/30 text-sm font-light flex-1">
        {tool.desc}
      </p>

      {/* 状态/箭头 */}
      <div className="mt-4 flex items-center justify-between">
        {isDisabled ? (
          <span className="text-xs text-white/20 px-3 py-1 rounded-full border border-white/10">
            即将上线
          </span>
        ) : (
          <>
            <span className="text-xs text-accent-cyan/60">可用</span>
            <ArrowRight 
              size={16} 
              className="text-white/30 group-hover:text-accent-cyan group-hover:translate-x-1 
                       transition-all duration-300" 
              strokeWidth={1.5}
            />
          </>
        )}
      </div>
    </div>
  )
}
