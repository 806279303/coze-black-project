import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Download, X, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react'

interface ProcessResult {
  id: string
  originalName: string
  status: 'processing' | 'success' | 'error'
  previewUrl?: string
  downloadUrl?: string
  error?: string
}

export default function WatermarkRemover() {
  const [isDragging, setIsDragging] = useState(false)
  const [results, setResults] = useState<ProcessResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // 文件上传处理
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      await processFiles(files)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      await processFiles(files)
    }
  }, [])

  // 处理文件
  const processFiles = async (files: File[]) => {
    setIsProcessing(true)
    
    const newResults: ProcessResult[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalName: file.name,
      status: 'processing',
    }))
    
    setResults(prev => [...newResults, ...prev])

    // 模拟处理（实际应调用后端API）
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const resultId = newResults[i].id
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
      
      setResults(prev => prev.map(r => 
        r.id === resultId 
          ? { 
              ...r, 
              status: 'success', 
              previewUrl,
              downloadUrl: previewUrl // 实际应该是处理后的图片URL
            }
          : r
      ))
    }
    
    setIsProcessing(false)
  }

  // 移除结果
  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id))
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
          智能去水印
        </h1>
        <p className="text-white/30 font-light tracking-wide">
          上传图片，一键去除水印
        </p>
      </motion.div>

      {/* 上传区域 */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative glass rounded-2xl p-16 text-center
            transition-all duration-500 cursor-pointer
            ${isDragging ? 'border-accent-cyan/50 bg-accent-cyan/5' : 'hover:border-white/20'}
          `}
        >
          {/* 脉冲环动画 */}
          {isDragging && (
            <>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-accent-cyan/30 pulse-ring" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border border-accent-cyan/20 pulse-ring" style={{ animationDelay: '0.5s' }} />
              </div>
            </>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="relative z-10">
            <div className={`
              w-16 h-16 mx-auto mb-4 rounded-xl 
              bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10
              border border-white/10 flex items-center justify-center
              transition-transform duration-300
              ${isDragging ? 'scale-110' : ''}
            `}>
              <Upload size={28} strokeWidth={1.5} className="text-accent-cyan/70" />
            </div>

            <p className="text-white/60 font-light mb-2">
              {isDragging ? '松开以上传' : '拖拽图片到此处'}
            </p>
            <p className="text-white/30 text-sm">
              或点击选择文件 · 支持 PNG、JPG、WEBP
            </p>
          </div>
        </div>
      </motion.div>

      {/* 处理结果列表 */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light text-white/60">
                处理结果 ({results.length})
              </h2>
              {isProcessing && (
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  处理中...
                </div>
              )}
            </div>

            {results.map((result, index) => (
              <motion.div
                key={result.id}
                className="glass rounded-xl p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* 预览图 */}
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  {result.previewUrl ? (
                    <img 
                      src={result.previewUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm truncate">{result.originalName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {result.status === 'processing' && (
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" />
                        处理中
                      </span>
                    )}
                    {result.status === 'success' && (
                      <span className="text-xs text-accent-cyan/70 flex items-center gap-1">
                        <CheckCircle size={10} />
                        完成
                      </span>
                    )}
                    {result.status === 'error' && (
                      <span className="text-xs text-red-400/70">{result.error}</span>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  {result.status === 'success' && result.downloadUrl && (
                    <motion.a
                      href={result.downloadUrl}
                      download={result.originalName}
                      className="px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20
                               text-accent-cyan/80 text-sm flex items-center gap-2
                               hover:bg-accent-cyan/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download size={14} />
                      下载
                    </motion.a>
                  )}
                  <button
                    onClick={() => removeResult(result.id)}
                    className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* API配置提示 */}
      <motion.div
        className="mt-8 glass rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-white/30 text-sm font-light">
          ⚠️ 当前为演示模式，需要配置去水印API才能正常使用。
          推荐使用 WaveSpeedAI（$0.012/张）或字节跳动AI开放平台。
        </p>
      </motion.div>
    </div>
  )
}
