import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, RefreshCw, Check, TrendingUp, Zap } from 'lucide-react'

interface GeneratedContent {
  id: string
  title: string
  copy: string
  tags: string[]
  hotScore: number
}

export default function TitleGenerator() {
  const [product, setProduct] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedContent[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 生成内容
  const handleGenerate = async () => {
    if (!product.trim()) return
    
    setIsGenerating(true)
    setResults([])

    // 模拟搜索和生成（实际应调用后端API搜索热门内容）
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟生成的结果
    const mockResults: GeneratedContent[] = [
      {
        id: '1',
        title: `${product}实测！我后悔没有早点发现`,
        copy: `姐妹们！这个${product}真的绝了！用了3天就看到效果，现在后悔没早点发现。分享给你们，不踩雷！#${keywords.split(',')[0] || '好物分享'} #亲测有效`,
        tags: ['实测分享', '好物推荐', '不踩雷'],
        hotScore: 98,
      },
      {
        id: '2',
        title: `${product}到底值不值得买？真实体验告诉你`,
        copy: `全网都在推${product}，真的有那么好吗？我替你们试了半个月，说真话！优缺点都告诉你，看完再决定要不要买。#${product}测评 #真实体验`,
        tags: ['真实测评', '避坑指南', '干货分享'],
        hotScore: 92,
      },
      {
        id: '3',
        title: `${product}让我从${keywords.split(',')[0] || '小白'}变达人！`,
        copy: `一个月前我还是${keywords.split(',')[0] || '小白'}，用了${product}之后，现在朋友都来问我！分享一下我的使用心得和小技巧～`,
        tags: ['使用技巧', '干货分享', '新手必看'],
        hotScore: 87,
      },
      {
        id: '4',
        title: `火了！${product}为什么这么火？深度解析`,
        copy: `最近${product}刷爆朋友圈，到底是营销还是真的好？今天给大家深度分析，看完这篇你就懂了！`,
        tags: ['深度解析', '行业揭秘', '知识分享'],
        hotScore: 85,
      },
    ]

    setResults(mockResults)
    setIsGenerating(false)
  }

  // 复制内容
  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题 */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extralight tracking-wider text-gradient mb-3">
          爆款文案生成
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          自动搜索热门内容，生成带货爆款标题和文案
        </p>
      </motion.div>

      {/* 输入区域 */}
      <motion.div
        className="glass rounded-2xl p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 产品名称 */}
          <div>
            <label className="block text-white/40 text-sm font-light mb-2">
              产品名称
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="例如：美白精华、扫地机器人"
              className="input-line text-white/80 placeholder:text-white/20 text-lg"
            />
          </div>

          {/* 关键词 */}
          <div>
            <label className="block text-white/40 text-sm font-light mb-2">
              关键词（可选）
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如：护肤,变美,好物"
              className="input-line text-white/80 placeholder:text-white/20 text-lg"
            />
          </div>
        </div>

        {/* 生成按钮 */}
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating || !product.trim()}
          className={`
            w-full py-4 rounded-xl flex items-center justify-center gap-3
            transition-all duration-300 text-sm tracking-widest
            ${isGenerating || !product.trim()
              ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/20 text-accent-cyan/80 hover:border-accent-cyan/40'
            }
          `}
          whileHover={!isGenerating && product.trim() ? { scale: 1.01 } : {}}
          whileTap={!isGenerating && product.trim() ? { scale: 0.99 } : {}}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              正在分析热门内容...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              生成爆款文案
            </>
          )}
        </motion.button>
      </motion.div>

      {/* 生成结果 */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-accent-cyan/60" />
              <span className="text-white/40 text-sm">已生成 {results.length} 条爆款文案</span>
            </div>

            {results.map((result, index) => (
              <motion.div
                key={result.id}
                className="glass rounded-xl p-6 group hover:bg-white/[0.03] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 热度分数 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-accent-cyan/60" />
                    <span className="text-xs text-white/30">爆款指数</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden"
                    >
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                        style={{ width: `${result.hotScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-accent-cyan/80 font-light">
                      {result.hotScore}
                    </span>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-light text-white/90 mb-3 tracking-wide">
                  {result.title}
                </h3>

                {/* 文案 */}
                <p className="text-white/50 font-light mb-4 leading-relaxed">
                  {result.copy}
                </p>

                {/* 标签 */}
                <div className="flex items-center gap-2 mb-4">
                  {result.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs text-white/40 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <motion.button
                    onClick={() => handleCopy(result.id, `${result.title}\n\n${result.copy}`)}
                    className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10
                             text-white/60 text-sm flex items-center justify-center gap-2
                             hover:bg-white/10 hover:text-white/80 transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {copiedId === result.id ? (
                      <>
                        <Check size={14} />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        复制全部
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleCopy(result.id + '-title', result.title)}
                    className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                             text-white/40 text-sm hover:text-white/60 transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    仅标题
                  </motion.button>
                  <motion.button
                    onClick={() => handleCopy(result.id + '-copy', result.copy)}
                    className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                             text-white/40 text-sm hover:text-white/60 transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    仅文案
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示 */}
      <motion.div
        className="mt-8 glass rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-white/30 text-sm font-light">
          💡 文案基于热门内容分析生成，建议根据实际产品特点适当调整
        </p>
      </motion.div>
    </div>
  )
}
