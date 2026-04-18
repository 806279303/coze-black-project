import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Plus, Edit2, Download, Filter
} from 'lucide-react'

type Tab = 'attendance' | 'schedule' | 'stats'

interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'normal' | 'late' | 'early_leave' | 'absent'
  note?: string
}

interface Schedule {
  id: string
  userId: string
  userName: string
  date: string
  shiftType: 'morning' | 'afternoon' | 'evening' | 'full'
  startTime: string
  endTime: string
  note?: string
}

interface Stats {
  userName: string
  totalDays: number
  presentDays: number
  lateDays: number
  earlyLeaveDays: number
  absentDays: number
  attendanceRate: number
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', userId: '1', userName: '主播A', date: '2026-04-18', checkIn: '07:55', checkOut: '15:30', status: 'normal' },
  { id: '2', userId: '2', userName: '主播B', date: '2026-04-18', checkIn: '08:10', checkOut: '16:00', status: 'late' },
  { id: '3', userId: '3', userName: '主播C', date: '2026-04-18', checkIn: '07:50', checkOut: '15:00', status: 'early_leave' },
  { id: '4', userId: '4', userName: '主播D', date: '2026-04-18', checkIn: null, checkOut: null, status: 'absent' },
  { id: '5', userId: '1', userName: '主播A', date: '2026-04-17', checkIn: '07:58', checkOut: '15:45', status: 'normal' },
  { id: '6', userId: '2', userName: '主播B', date: '2026-04-17', checkIn: '08:00', checkOut: '16:00', status: 'normal' },
]

const mockSchedules: Schedule[] = [
  { id: '1', userId: '1', userName: '主播A', date: '2026-04-18', shiftType: 'morning', startTime: '08:00', endTime: '16:00' },
  { id: '2', userId: '2', userName: '主播B', date: '2026-04-18', shiftType: 'afternoon', startTime: '14:00', endTime: '22:00' },
  { id: '3', userId: '3', userName: '主播C', date: '2026-04-18', shiftType: 'evening', startTime: '18:00', endTime: '23:00' },
  { id: '4', userId: '4', userName: '主播D', date: '2026-04-19', shiftType: 'full', startTime: '08:00', endTime: '23:00' },
]

const mockStats: Stats[] = [
  { userName: '主播A', totalDays: 22, presentDays: 21, lateDays: 1, earlyLeaveDays: 0, absentDays: 1, attendanceRate: 95.5 },
  { userName: '主播B', totalDays: 22, presentDays: 20, lateDays: 3, earlyLeaveDays: 1, absentDays: 2, attendanceRate: 90.9 },
  { userName: '主播C', totalDays: 22, presentDays: 22, lateDays: 0, earlyLeaveDays: 2, absentDays: 0, attendanceRate: 100 },
  { userName: '主播D', totalDays: 22, presentDays: 19, lateDays: 2, earlyLeaveDays: 0, absentDays: 3, attendanceRate: 86.4 },
]

const anchors = ['主播A', '主播B', '主播C', '主播D', '主播E', '主播F']

export default function Attendance() {
  const [activeTab, setActiveTab] = useState<Tab>('attendance')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalType, setModalType] = useState<'attendance' | 'schedule'>('attendance')

  const tabs = [
    { key: 'attendance' as Tab, label: '考勤记录', icon: CheckCircle },
    { key: 'schedule' as Tab, label: '排班管理', icon: Calendar },
    { key: 'stats' as Tab, label: '考勤统计', icon: TrendingUp },
  ]

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const styles = {
      normal: 'bg-green-400/10 text-green-400 border-green-400/20',
      late: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      early_leave: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
      absent: 'bg-red-400/10 text-red-400 border-red-400/20',
    }
    const labels = {
      normal: '正常',
      late: '迟到',
      early_leave: '早退',
      absent: '缺勤',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getShiftBadge = (shift: Schedule['shiftType']) => {
    const styles = {
      morning: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
      afternoon: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
      evening: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
      full: 'bg-white/10 text-white/60 border-white/20',
    }
    const labels = {
      morning: '早班',
      afternoon: '午班',
      evening: '晚班',
      full: '全天',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[shift]}`}>
        {labels[shift]}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
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
          主播考勤
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          考勤记录 · 排班管理 · 统计报表
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
        {activeTab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setModalType('attendance'); setShowAddModal(true) }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={16} />
                  录入考勤
                </button>
                <button className="btn-ghost flex items-center gap-2">
                  <Filter size={14} />
                  筛选
                </button>
              </div>
              <button className="btn-ghost flex items-center gap-2">
                <Download size={14} />
                导出报表
              </button>
            </div>

            {/* 考勤列表 */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/30 font-light tracking-wide">
                <div>日期</div>
                <div>主播</div>
                <div>上班打卡</div>
                <div>下班打卡</div>
                <div>状态</div>
                <div>备注</div>
                <div className="text-right">操作</div>
              </div>

              {mockAttendance.map((record, index) => (
                <motion.div
                  key={record.id}
                  className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 
                           items-center hover:bg-white/[0.02] transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="text-white/70 text-sm">{record.date}</div>
                  <div className="text-white/70 text-sm">{record.userName}</div>
                  <div className="text-white/50 text-sm">{record.checkIn || '-'}</div>
                  <div className="text-white/50 text-sm">{record.checkOut || '-'}</div>
                  <div>{getStatusBadge(record.status)}</div>
                  <div className="text-white/30 text-sm">{record.note || '-'}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 月份导航 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-white/70 font-light text-lg">
                  {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setModalType('schedule'); setShowAddModal(true) }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={16} />
                  添加排班
                </button>
              </div>
            </div>

            {/* 排班日历 */}
            <div className="glass rounded-2xl p-6">
              {/* 星期标题 */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className="text-center text-white/30 text-xs py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 日期网格 */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
                  const day = i - firstDay + 1
                  const isValidDay = day > 0 && day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
                  const dateStr = isValidDay 
                    ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    : null
                  
                  const daySchedules = dateStr 
                    ? mockSchedules.filter(s => s.date === dateStr)
                    : []

                  return (
                    <motion.div
                      key={i}
                      className={`
                        aspect-square rounded-lg p-1 text-sm
                        ${isValidDay ? 'bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer' : ''}
                        transition-all
                      `}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                    >
                      {isValidDay && (
                        <>
                          <div className="text-white/40 text-xs mb-1">{day}</div>
                          <div className="space-y-0.5">
                            {daySchedules.slice(0, 2).map((s) => (
                              <div 
                                key={s.id}
                                className="text-[10px] px-1 py-0.5 rounded truncate"
                                style={{
                                  backgroundColor: s.shiftType === 'morning' ? 'rgba(0, 245, 212, 0.1)' :
                                                  s.shiftType === 'afternoon' ? 'rgba(123, 44, 191, 0.1)' :
                                                  'rgba(247, 37, 133, 0.1)',
                                  color: s.shiftType === 'morning' ? 'rgba(0, 245, 212, 0.8)' :
                                        s.shiftType === 'afternoon' ? 'rgba(123, 44, 191, 0.8)' :
                                        'rgba(247, 37, 133, 0.8)',
                                }}
                              >
                                {s.userName}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 总览卡片 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: '本月出勤率', value: '94.2%', color: 'accent-cyan', icon: CheckCircle },
                { label: '迟到人次', value: '6', color: 'yellow-400', icon: Clock },
                { label: '早退人次', value: '3', color: 'orange-400', icon: TrendingUp },
                { label: '缺勤人次', value: '2', color: 'red-400', icon: XCircle },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-xl p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                      <stat.icon size={16} className={`text-${stat.color}/60`} />
                    </div>
                    <p className="text-white/30 text-xs">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-extralight text-${stat.color}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* 详细统计表 */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 text-xs text-white/30 font-light">
                <div>主播</div>
                <div>应出勤</div>
                <div>实出勤</div>
                <div>迟到</div>
                <div>早退</div>
                <div>缺勤</div>
                <div>出勤率</div>
              </div>

              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.userName}
                  className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="text-white/70 text-sm">{stat.userName}</div>
                  <div className="text-white/50 text-sm">{stat.totalDays}天</div>
                  <div className="text-white/50 text-sm">{stat.presentDays}天</div>
                  <div className="text-yellow-400/70 text-sm">{stat.lateDays}次</div>
                  <div className="text-orange-400/70 text-sm">{stat.earlyLeaveDays}次</div>
                  <div className="text-red-400/70 text-sm">{stat.absentDays}天</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-accent-cyan"
                          style={{ width: `${stat.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-accent-cyan/80 text-sm">{stat.attendanceRate}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 录入弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="glass rounded-2xl p-8 w-[500px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-white/80">
                  {modalType === 'attendance' ? '录入考勤' : '添加排班'}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </button>
              </div>

              {modalType === 'attendance' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">日期</label>
                    <input type="date" className="w-full input-line text-white/80" />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">主播</label>
                    <select className="w-full input-line text-white/80 bg-transparent">
                      {anchors.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/40 text-sm mb-2">上班打卡</label>
                      <input type="time" className="w-full input-line text-white/80" />
                    </div>
                    <div>
                      <label className="block text-white/40 text-sm mb-2">下班打卡</label>
                      <input type="time" className="w-full input-line text-white/80" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">备注</label>
                    <input type="text" className="w-full input-line text-white/80" placeholder="可选" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">日期</label>
                    <input type="date" className="w-full input-line text-white/80" />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">主播</label>
                    <select className="w-full input-line text-white/80 bg-transparent">
                      {anchors.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">班次</label>
                    <select className="w-full input-line text-white/80 bg-transparent">
                      <option value="morning">早班 (08:00-16:00)</option>
                      <option value="afternoon">午班 (14:00-22:00)</option>
                      <option value="evening">晚班 (18:00-23:00)</option>
                      <option value="full">全天 (08:00-23:00)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="btn-ghost">取消</button>
                <button className="btn-primary">确认</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
