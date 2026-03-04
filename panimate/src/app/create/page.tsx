'use client'

import { useState, useRef, useEffect } from 'react'

const THEMES = [
  { id: 'happy', emoji: '😊', name: 'Happy', color: '#FFD700' },
  { id: 'love', emoji: '💕', name: 'Love', color: '#FF69B4' },
  { id: 'excited', emoji: '🎉', name: 'Excited', color: '#FF4500' },
  { id: 'cool', emoji: '😎', name: 'Cool', color: '#4169E1' },
  { id: 'cute', emoji: '🐱', name: 'Cute', color: '#FFB6C1' },
  { id: 'magical', emoji: '✨', name: 'Magical', color: '#9370DB' },
]

export default function CreatePage() {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [showMagic, setShowMagic] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mouthTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate audio level when recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
        // Simulate audio level with random values
        setAudioLevel(Math.random())
        setMouthOpen(Math.random())
        
        // Draw waveform
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            const width = canvasRef.current.width
            const height = canvasRef.current.height
            const barWidth = 3
            const gap = 2
            const bars = Math.floor(width / (barWidth + gap))
            
            ctx.fillStyle = '#1a1a2e'
            ctx.fillRect(0, 0, width, height)
            
            ctx.fillStyle = selectedTheme.color
            for (let i = 0; i < bars; i++) {
              const barHeight = Math.random() * height * 0.8 + height * 0.1
              const x = i * (barWidth + gap)
              const y = (height - barHeight) / 2
              ctx.fillRect(x, y, barWidth, barHeight)
            }
          }
        }
      }, 50)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setAudioLevel(0)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording, selectedTheme.color])

  // Idle animation
  useEffect(() => {
    if (!isRecording && !isPreview) {
      const breathe = () => {
        setMouthOpen(prev => {
          const newVal = Math.sin(Date.now() / 1000) * 0.2 + 0.2
          return newVal
        })
      }
      const interval = setInterval(breathe, 50)
      return () => clearInterval(interval)
    }
  }, [isRecording, isPreview])

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setIsPreview(false)
    setShowMagic(false)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setShowMagic(true)
    
    // After celebration, show preview
    setTimeout(() => {
      setShowMagic(false)
      setIsPreview(true)
      // Simulate mouth movement during preview
      mouthTimerRef.current = setInterval(() => {
        setMouthOpen(Math.random() * 0.8 + 0.2)
      }, 100)
    }, 2000)
  }

  const resetRecording = () => {
    setIsRecording(false)
    setIsPreview(false)
    setShowMagic(false)
    setRecordingTime(0)
    setMouthOpen(0)
    setAudioLevel(0)
    if (mouthTimerRef.current) clearInterval(mouthTimerRef.current)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-white">Panimate</a>
        <a href="/" className="text-sm text-gray-400 hover:text-white">← Back</a>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Animation Canvas */}
        <div 
          className="relative w-80 h-80 rounded-full overflow-hidden mb-8"
          style={{ 
            background: `radial-gradient(circle, ${selectedTheme.color}33 0%, transparent 70%)`,
            boxShadow: `0 0 60px ${selectedTheme.color}44`
          }}
        >
          {/* Animated Character */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Face */}
            <div 
              className="w-48 h-48 rounded-full flex items-center justify-center transition-all duration-100"
              style={{ 
                backgroundColor: selectedTheme.color,
                transform: `scale(${1 + mouthOpen * 0.1})`
              }}
            >
              {/* Eyes */}
              <div className="flex gap-8 -mt-2">
                <div className={`w-6 h-8 bg-white rounded-full relative ${isRecording || isPreview ? 'animate-bounce' : ''}`}>
                  <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="w-6 h-8 bg-white rounded-full relative">
                  <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              
              {/* Mouth */}
              <div 
                className="absolute bg-black rounded-full transition-all duration-75"
                style={{ 
                  width: `${20 + mouthOpen * 30}px`,
                  height: `${10 + mouthOpen * 20}px`,
                  bottom: '40px'
                }}
              />
              
              {/* Cheeks */}
              <div className="absolute w-8 h-4 bg-white/30 rounded-full -left-4 top-1/2" />
              <div className="absolute w-8 h-4 bg-white/30 rounded-full -right-4 top-1/2" />
            </div>
          </div>
          
          {/* Celebration Effect */}
          {showMagic && (
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Magic Toast */}
        {showMagic && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full animate-bounce">
            <span className="text-white">✨ Your magic is ready!</span>
          </div>
        )}

        {/* Waveform Visualizer */}
        <canvas 
          ref={canvasRef}
          width={300}
          height={60}
          className={`mb-8 rounded-lg transition-opacity duration-200 ${isRecording ? 'opacity-100' : 'opacity-30'}`}
        />

        {/* Theme Tray */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 max-w-full">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => !isRecording && setSelectedTheme(theme)}
              disabled={isRecording}
              className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all ${
                selectedTheme.id === theme.id 
                  ? 'border-white scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: `${theme.color}33`,
                borderColor: selectedTheme.id === theme.id ? theme.color : 'transparent'
              }}
            >
              <span className="text-2xl mr-2">{theme.emoji}</span>
              <span className="text-white text-sm">{theme.name}</span>
            </button>
          ))}
        </div>

        {/* Hold to Record Button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 scale-90 animate-pulse' 
              : 'bg-gradient-to-br from-pink-500 to-purple-500 hover:scale-105'
          }`}
        >
          <span className="text-4xl mb-1">{isRecording ? '⏺' : '🎤'}</span>
          <span className="text-white text-xs font-medium">
            {isRecording ? formatTime(recordingTime) : 'Hold to Record'}
          </span>
        </button>

        {/* Preview Controls */}
        {isPreview && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              🔄 Re-record
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 rounded-full text-white font-medium"
            >
              📤 Share Magic
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>You just cast a spell. ✨</p>
      </footer>
    </div>
  )
}
