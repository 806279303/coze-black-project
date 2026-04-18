import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Download, FolderOpen, FileText, Clock, CheckCircle,
  MoreVertical, Trash2, Eye, Search, Plus, X
} from 'lucide-react'

type Tab = 'files' | 'tasks' | 'reports'

interface FileItem {
  id: string
  name: string
  size: string
  type: string
  uploader: string
  uploadTime: string
  isOwner: boolean
}

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  deadline: string
  assignee: string
}

const mockFiles: FileItem[] = [
  { id: '1', name: '直播切片-0418-01.mp4', size: '45.2 MB', type: 'video', uploader: '大V', uploadTime: '2026-04-18 10:30', isOwner: false },
  { id: '2', name: '产品介绍-精华版.mp4', size: '128 MB', type: 'video', uploader: '剪辑师A', uploadTime: '2026-04-18 09:15', isOwner: true },
  { id: '3', name: '素材-背景音乐.mp3', size: '3.5 MB', type: 'audio', uploader: '剪辑师B', uploadTime: '2026-04-17 16:45', isOwner: false },
  { id: '4', name: '封面图-零食专场.png', size: '1.2 MB', type: 'image', uploader: '大V', uploadTime: '2026-04-17 14:20', isOwner: false },
]

const mockTasks: Task[] = [
  { id: '1', title: '直播切片-零食专场', description: '截取高光片段，做成3个短视频', status: 'in_progress', priority: 'high', deadline: '2026-04-18 18:00', assignee: '剪辑师A' },
  { id: '2', title: '产品介绍视频', description: '制作新产品介绍视频，时长30-60秒', status: 'pending', priority: 'normal', deadline: '2026-04-19 12:00', assignee: '剪辑师A' },
  { id: '3', title: '历史素材整理', description: '整理4月份所有直播素材，分类归档', status: 'completed', priority: 'low', deadline: '2026-04-17 18:00', assignee: '剪辑师A' },
]

export default function EditorWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>('files')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const tabs = [
    { key: 'files' as Tab, label: '文件管理', icon: FolderOpen },
    { key: 'tasks' as Tab, label: '任务列表', icon: CheckCircle },
    { key: 'reports' as Tab, label: '每日汇报', icon: FileText },
  ]

  const filteredFiles = mockFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'text-white/40'
      case 'in_progress': return 'text-accent-cyan'
      case 'completed': return 'text-green-400'
    }
  }

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '待开始'
      case 'in_progress': return '进行中'
      case 'completed': return '已完成'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'border-white/20 text-white/40'
      case 'normal': return 'border-white/30 text-white/60'
      case 'high': return 'border-accent-cyan/30 text-accent-cyan/80'
      case 'urgent': return 'border-accent-pink/30 text-accent-pink/80'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 标题 */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extralight tracking-wider text-gradient mb-3">
          剪辑师工作台
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          文件管理 · 任务追踪 · 工作汇报
        </p>
      </motion.div>

      {/* 标签切换 */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-6 py-2.5 rounded-xl flex items-center gap-2
              transition-all duration-300 text-sm font-light tracking-wide
              ${activeTab === tab.key
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* 内容区 */}
      <AnimatePresence mode="wait">
        {activeTab === 'files' && (
          <motion.div
            key="files"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6">
              {/* 搜索 */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文件..."
                  className="pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                           text-white/80 placeholder:text-white/20 text-sm w-64
                           focus:border-white/20 focus:outline-none transition-all"
                />
              </div>

              {/* 上传按钮 */}
              <motion.button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload size={16} />
                上传文件
              </motion.button>
            </div>

            {/* 文件列表 */}
            <div className="glass rounded-2xl overflow-hidden">
              {/* 表头 */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/30 font-light tracking-wide">
                <div className="col-span-5">文件名</div>
                <div className="col-span-2">大小</div>
                <div className="col-span-2">上传者</div>
                <div className="col-span-2">时间</div>
                <div className="col-span-1 text-right">操作</div>
              </div>

              {/* 文件项 */}
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 
                           items-center hover:bg-white/[0.02] transition-colors group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 
                                  flex items-center justify-center flex-shrink-0">
                      {file.type === 'video' && <span className="text-accent-cyan/60">📹</span>}
                      {file.type === 'image' && <span className="text-accent-purple/60">🖼</span>}
                      {file.type === 'audio' && <span className="text-accent-pink/60">🎵</span>}
                    </div>
                    <span className="text-white/70 text-sm truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-white/40 text-sm">{file.size}</div>
                  <div className="col-span-2 text-white/40 text-sm">{file.uploader}</div>
                  <div className="col-span-2 text-white/30 text-sm">{file.uploadTime}</div>
                  <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                      <Download size={14} />
                    </button>
                    {file.isOwner && (
                      <button className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {mockTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="glass rounded-xl p-6 hover:bg-white/[0.02] transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-2 h-2 rounded-full mt-2
                      ${task.status === 'completed' ? 'bg-green-400' : 
                        task.status === 'in_progress' ? 'bg-accent-cyan' : 'bg-white/30'}
                    `} />
                    <h3 className="text-white/80 font-light">{task.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'urgent' ? '紧急' : 
                       task.priority === 'high' ? '高优先' : 
                       task.priority === 'normal' ? '普通' : '低'}
                    </span>
                    <span className={`text-xs ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/40 text-sm mb-4 ml-5">{task.description}</p>
                
                <div className="flex items-center justify-between ml-5">
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      截止：{task.deadline}
                    </span>
                    <span>负责人：{task.assignee}</span>
                  </div>
                  
                  {task.status !== 'completed' && (
                    <motion.button
                      className="text-xs px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20
                               text-accent-cyan/80 hover:bg-accent-cyan/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {task.status === 'pending' ? '开始任务' : '完成任务'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 今日统计 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: '完成任务', value: '3', color: 'accent-cyan' },
                { label: '处理文件', value: '12', color: 'accent-purple' },
                { label: '工作时长', value: '6.5h', color: 'accent-pink' },
                { label: '待处理', value: '2', color: 'white/40' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-xl p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-white/30 text-xs mb-2">{stat.label}</p>
                  <p className={`text-2xl font-extralight text-${stat.color}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* 提交汇报按钮 */}
            <motion.button
              onClick={() => setShowReportModal(true)}
              className="w-full glass rounded-xl p-6 text-center hover:bg-white/[0.02] transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <Plus size={24} className="mx-auto mb-2 text-white/30" />
              <span className="text-white/40 text-sm">提交今日工作汇报</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传弹窗 */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="glass rounded-2xl p-8 w-[500px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-white/80">上传文件</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center 
                            hover:border-white/20 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-4 text-white/30" />
                <p className="text-white/40 mb-2">拖拽文件到此处</p>
                <p className="text-white/20 text-sm">或点击选择文件</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn-ghost"
                >
                  取消
                </button>
                <button className="btn-primary">
                  确认上传
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 汇报弹窗 */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              className="glass rounded-2xl p-8 w-[500px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-white/80">今日工作汇报</h3>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/40 text-sm mb-2">完成任务数</label>
                  <input 
                    type="number" 
                    className="w-full input-line text-white/80"
                    placeholder="请输入..."
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">工作内容</label>
                  <textarea 
                    className="w-full input-line text-white/80 resize-none"
                    rows={4}
                    placeholder="描述今天完成的工作..."
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">遇到的问题（可选）</label>
                  <textarea 
                    className="w-full input-line text-white/80 resize-none"
                    rows={2}
                    placeholder="有什么需要协调的问题..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="btn-ghost"
                >
                  取消
                </button>
                <button className="btn-primary">
                  提交汇报
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
