import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Eye, RefreshCw, Download, Calendar, Filter
} from 'lucide-react'

type TimeRange = 'today' | 'week' | 'month' | 'custom'

interface MetricCard {
  label: string
  value: string
  change?: number
  changeLabel?: string
  icon: typeof TrendingUp
  color: string
}

interface DataPoint {
  date: string
  roi: number
  gmv: number
  cost: number
}

const mockDailyData: DataPoint[] = [
  { date: '04-12', roi: 2.8, gmv: 85600, cost: 30500 },
  { date: '04-13', roi: 3.1, gmv: 92300, cost: 29700 },
  { date: '04-14', roi: 2.5, gmv: 72100, cost: 28800 },
  { date: '04-15', roi: 3.4, gmv: 108900, cost: 32000 },
  { date: '04-16', roi: 2.9, gmv: 89200, cost: 30700 },
  { date: '04-17', roi: 3.2, gmv: 102400, cost: 32000 },
  { date: '04-18', roi: 3.25, gmv: 128560, cost: 39540 },
]

const metrics: MetricCard[] = [
  { 
    label: '净成交ROI', 
    value: '3.25', 
    change: 8.2, 
    changeLabel: '较昨日',
    icon: TrendingUp, 
    color: 'accent-cyan' 
  },
  { 
    label: 'GMV', 
    value: '¥128,560', 
    change: 12.5, 
    changeLabel: '较昨日',
    icon: ShoppingCart, 
    color: 'accent-purple' 
  },
  { 
    label: '投流花费', 
    value: '¥39,540', 
    change: -5.3, 
    changeLabel: '较昨日',
    icon: DollarSign, 
    color: 'accent-pink' 
  },
  { 
    label: '成交订单', 
    value: '89单', 
    change: 15.2, 
    changeLabel: '较昨日',
    icon: ShoppingCart, 
    color: 'green-400' 
  },
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCustomDate, setShowCustomDate] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const maxRoi = Math.max(...mockDailyData.map(d => d.roi))
  const maxGmv = Math.max(...mockDailyData.map(d => d.gmv))

  return (
    <div className="max-w-6xl mx-auto">
      {/* 标题 */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extralight tracking-wider text-gradient mb-3">
          投流数据看板
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          实时监控 · 数据分析 · ROI追踪
        </p>
      </motion.div>

      {/* 时间选择 & 操作栏 */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          {[
            { key: 'today' as TimeRange, label: '今日' },
            { key: 'week' as TimeRange, label: '本周' },
            { key: 'month' as TimeRange, label: '本月' },
            { key: 'custom' as TimeRange, label: '自定义' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setTimeRange(item.key)
                if (item.key === 'custom') setShowCustomDate(true)
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-light transition-all duration-300
                ${timeRange === item.key
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-ghost flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </motion.button>
          <motion.button
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={14} />
            导出报表
          </motion.button>
        </div>
      </motion.div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="glass rounded-xl p-6 group hover:bg-white/[0.04] transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${metric.color}/10 
                            border border-${metric.color}/20 flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon size={18} className={`text-${metric.color}/70`} />
              </div>
              {metric.change !== undefined && (
                <div className={`flex items-center gap-1 text-xs
                              ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(metric.change)}%
                </div>
              )}
            </div>
            
            <p className="text-2xl font-extralight text-white/90 mb-1">{metric.value}</p>
            <p className="text-xs text-white/30">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* ROI趋势图 */}
        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white/60 text-sm font-light mb-6">ROI趋势</h3>
          
          <div className="h-48 flex items-end justify-between gap-3">
            {mockDailyData.map((item, index) => (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent-cyan/30 to-accent-cyan/80"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.roi / maxRoi) * 100}%` }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                />
                <span className="text-[10px] text-white/30">{item.date}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-white/40">平均值: <span className="text-accent-cyan">3.02</span></span>
              <span className="text-white/40">最高: <span className="text-accent-cyan">3.4</span></span>
            </div>
          </div>
        </motion.div>

        {/* GMV趋势图 */}
        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white/60 text-sm font-light mb-6">GMV趋势</h3>
          
          <div className="h-48 flex items-end justify-between gap-3">
            {mockDailyData.map((item, index) => (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent-purple/30 to-accent-purple/80"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.gmv / maxGmv) * 100}%` }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                />
                <span className="text-[10px] text-white/30">{item.date}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-white/40">累计: <span className="text-accent-purple">¥679,060</span></span>
              <span className="text-white/40">日均: <span className="text-accent-purple">¥97,008</span></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 投放明细表 */}
      <motion.div
        className="glass rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white/60 text-sm font-light">今日投放明细</h3>
          <button className="text-white/30 hover:text-white/60 text-xs flex items-center gap-1 transition-colors">
            <Filter size={12} />
            筛选
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-white/5 text-xs text-white/30 font-light">
          <div>时间</div>
          <div className="col-span-2">计划名称</div>
          <div>花费</div>
          <div>GMV</div>
          <div>ROI</div>
          <div className="text-right">状态</div>
        </div>

        {[
          { time: '08:00', name: '零食专场-主推款', cost: 8500, gmv: 28500, roi: 3.35, status: '投放中' },
          { time: '10:00', name: '零食专场-爆款引流', cost: 12300, gmv: 41200, roi: 3.35, status: '投放中' },
          { time: '14:00', name: '零食专场-下午场', cost: 9200, gmv: 29440, roi: 3.20, status: '投放中' },
          { time: '18:00', name: '零食专场-晚高峰', cost: 9540, gmv: 29420, roi: 3.08, status: '投放中' },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 items-center
                     hover:bg-white/[0.02] transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
          >
            <div className="text-white/50 text-sm">{item.time}</div>
            <div className="col-span-2 text-white/70 text-sm truncate">{item.name}</div>
            <div className="text-white/50 text-sm">¥{item.cost.toLocaleString()}</div>
            <div className="text-white/50 text-sm">¥{item.gmv.toLocaleString()}</div>
            <div className="text-accent-cyan text-sm">{item.roi}</div>
            <div className="text-right">
              <span className="px-2 py-1 text-xs rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 数据同步提示 */}
      <motion.div
        className="mt-6 glass rounded-xl p-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/40 text-sm">
            数据最后同步: 2026-04-18 15:00
          </span>
        </div>
        <span className="text-white/20 text-xs">
          数据来源: 巨量千川API
        </span>
      </motion.div>
    </div>
  )
}
