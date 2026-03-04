'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Card themes
const THEMES = [
  { id: 'mom', emoji: '🌸', name: 'Mom', color: '#ec4899', bg: 'from-pink-300 to-purple-400', text: 'Happy Mother\'s Day!' },
  { id: 'dad', emoji: '🎉', name: 'Dad', color: '#3b82f6', bg: 'from-blue-400 to-cyan-300', text: 'Happy Father\'s Day!' },
  { id: 'love', emoji: '💕', name: 'Love', color: '#f43f5e', bg: 'from-rose-400 to-pink-400', text: 'I Love You!' },
  { id: 'birthday', emoji: '🎂', name: 'Birthday', color: '#f59e0b', bg: 'from-yellow-400 to-orange-400', text: 'Happy Birthday!' },
  { id: 'thanks', emoji: '🙏', name: 'Thanks', color: '#10b981', bg: 'from-emerald-400 to-teal-400', text: 'Thank You!' },
  { id: 'congrats', emoji: '🎊', name: 'Congrats', color: '#8b5cf6', bg: 'from-violet-400 to-purple-400', text: 'Congratulations!' },
]

export default function CreatePage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [generatedCard, setGeneratedCard] = useState<{text: string; audioUrl: string} | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [cardId, setCardId] = useState('')
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Try Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript + ' '
        } else {
          interim += transcript
        }
      }
      
      if (final) {
        setTranscript(prev => prev + final)
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still supposed to be recording
        recognition.start()
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = () => {
    setTranscript('')
    setInterimTranscript('')
    setIsRecording(true)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Failed to start recognition:', e)
      }
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const generateCard = () => {
    if (!transcript.trim()) {
      alert('Please record a message first!')
      return
    }

    setIsGenerating(true)
    
    // Simulate card generation
    setTimeout(() => {
      // Generate a unique card ID
      const id = Math.random().toString(36).substring(2, 10)
      setCardId(id)
      setGeneratedCard({
        text: transcript.trim(),
        audioUrl: ''
      })
      setIsGenerating(false)
    }, 1500)
  }

  const resetAndRecordAgain = () => {
    setTranscript('')
    setInterimTranscript('')
    setGeneratedCard(null)
    setCardId('')
  }

  const shareCard = () => {
    const shareUrl = `https://panimate.vercel.app/card/${cardId}`
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard! Send it to your loved one.')
  }

  // If we have a generated card, show it
  if (generatedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-white/50 backdrop-blur">
          <button onClick={() => router.push('/')} className="text-2xl font-bold text-pink-600">✨ Panimate</button>
        </header>

        {/* Generated Card */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Card Preview */}
            <div className={`bg-gradient-to-br ${selectedTheme.bg} rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-4xl">{selectedTheme.emoji}</div>
              <div className="absolute top-4 right-4 text-4xl">✨</div>
              <div className="absolute bottom-4 left-4 text-4xl">💫</div>
              <div className="absolute bottom-4 right-4 text-4xl">{selectedTheme.emoji}</div>
              
              {/* Message */}
              <div className="relative z-10 py-8">
                <p className="text-3xl font-bold text-white drop-shadow-lg mb-4">{selectedTheme.text}</p>
                <div className="bg-white/90 rounded-2xl p-6 shadow-inner">
                  <p className="text-gray-800 text-xl leading-relaxed italic">"{generatedCard.text}"</p>
                </div>
                <p className="text-white/80 text-sm mt-4">— A voice card from Panimate</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={resetAndRecordAgain}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300"
              >
                🔄 Record Again
              </button>
              <button 
                onClick={shareCard}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:opacity-90"
              >
                📤 Share Card
              </button>
            </div>

            {/* Share Link */}
            <div className="mt-4 p-4 bg-white rounded-xl shadow">
              <p className="text-sm text-gray-500 mb-2">Share this link:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block truncate">
                https://panimate.vercel.app/card/{cardId}
              </code>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white/50 backdrop-blur">
        <button onClick={() => router.push('/')} className="text-2xl font-bold text-pink-600">✨ Panimate</button>
        <a href="/" className="text-gray-500 hover:text-gray-700">← Back</a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create a Voice Card</h1>
        <p className="text-gray-600 mb-8">Record your voice, we'll turn it into a beautiful card</p>

        {/* Theme Picker */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 max-w-full">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all ${
                selectedTheme.id === theme.id 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: theme.color + '20'
              }}
            >
              <span className="text-xl mr-1">{theme.emoji}</span>
              <span className="text-gray-700 text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>

        {/* Card Preview */}
        <div className={`w-64 h-40 bg-gradient-to-br ${selectedTheme.bg} rounded-2xl p-4 shadow-lg mb-8 flex items-center justify-center`}>
          <span className="text-5xl">{selectedTheme.emoji}</span>
        </div>

        {/* Recording Area */}
        <div className="w-full max-w-md">
          {/* Transcript Display */}
          <div className="bg-white rounded-2xl p-4 mb-4 min-h-[100px] shadow-inner">
            <p className="text-gray-800">
              {transcript}
              <span className="text-gray-400">{interimTranscript}</span>
              {!transcript && !interimTranscript && (
                <span className="text-gray-400 italic">
                  {isRecording ? 'Listening...' : 'Press the button and start talking...'}
                </span>
              )}
            </p>
          </div>

          {/* Record Button */}
          <div className="flex flex-col items-center">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl ${
                isRecording 
                  ? 'bg-red-500 scale-90 animate-pulse' 
                  : 'bg-gradient-to-br from-pink-500 to-purple-600 hover:scale-105'
              }`}
            >
              <span className="text-4xl mb-1">{isRecording ? '⏹️' : '🎤'}</span>
            </button>
            <p className="text-gray-500 mt-2 text-sm">
              {isRecording ? 'Release to stop' : 'Hold to record'}
            </p>
          </div>

          {/* Generate Button */}
          {transcript && !isRecording && (
            <button
              onClick={generateCard}
              disabled={isGenerating}
              className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50"
            >
              {isGenerating ? '🎨 Generating your card...' : '✨ Create My Card'}
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>You just cast a spell. ✨</p>
      </footer>
    </div>
  )
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
