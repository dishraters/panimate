'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Pricing tiers
const TIERS = {
  free: { id: 'free', name: 'Free', price: 0, duration: '15 sec', features: ['Animated words', 'Share via link'], color: 'gray' },
  pro: { id: 'pro', name: 'Pro', price: 0.99, duration: '30 sec', features: ['Enhanced animations', 'Smooth transitions', 'HD download'], color: 'pink' },
  premium: { id: 'premium', name: 'Premium', price: 10, duration: '60 sec', features: ['Manual review', 'Custom edits', '4K download', 'Priority'], color: 'purple' },
}

// Card themes
const THEMES = [
  { id: 'mom', emoji: '🌸', name: 'Mom', color: '#ec4899', bg: 'from-pink-300 to-purple-400', text: 'Happy Mother\'s Day!' },
  { id: 'dad', emoji: '🎉', name: 'Dad', color: '#3b82f6', bg: 'from-blue-400 to-cyan-300', text: 'Happy Father\'s Day!' },
  { id: 'love', emoji: '💕', name: 'Love', color: '#f43f5e', bg: 'from-rose-400 to-pink-400', text: 'I Love You!' },
  { id: 'birthday', emoji: '🎂', name: 'Birthday', color: '#f59e0b', bg: 'from-yellow-400 to-orange-400', text: 'Happy Birthday!' },
  { id: 'thanks', emoji: '🙏', name: 'Thanks', color: '#10b981', bg: 'from-emerald-400 to-teal-400', text: 'Thank You!' },
  { id: 'congrats', emoji: '🎊', name: 'Congrats', color: '#8b5cf6', bg: 'from-violet-400 to-purple-400', text: 'Congratulations!' },
]

const MAX_BUBBLES = 12

export default function CreatePage() {
  const router = useRouter()
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <CreatePageContent />
    </Suspense>
  )
}

function CreatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTier = (searchParams.get('tier') as keyof typeof TIERS) || 'free'
  
  const [selectedTier, setSelectedTier] = useState<keyof typeof TIERS>(initialTier)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [isRecording, setIsRecording] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [generatedCard, setGeneratedCard] = useState<{text: string; audioUrl: string; tier: string} | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [cardId, setCardId] = useState('')
  const [wordBubbles, setWordBubbles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [browserSupported, setBrowserSupported] = useState(true)
  
  const recognitionRef = useRef<any>(null)
  const lastFinalRef = useRef('')

  useEffect(() => {
    // Check for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setBrowserSupported(false)
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge for the best experience.')
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
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (result.isFinal && text) {
          final += text + ' '
        } else {
          interim += text
        }
      }
      
      if (final) {
        const newText = lastFinalRef.current + final
        lastFinalRef.current = newText
        setTranscript(newText)
        
        // Add words as bubbles
        const words = final.trim().split(/\s+/)
        setWordBubbles(prev => {
          const updated = [...prev, ...words].slice(-MAX_BUBBLES)
          return updated
        })
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings and try again.')
      } else if (event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`)
      }
      setIsRecording(false)
    }

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still supposed to be recording
        try {
          recognition.start()
        } catch (e) {
          console.error('Failed to restart recognition:', e)
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
    }
  }, [isRecording])

  const startRecording = () => {
    if (!browserSupported) return
    
    setError(null)
    setTranscript('')
    setInterimTranscript('')
    setWordBubbles([])
    lastFinalRef.current = ''
    setShowDone(false)
    setIsRecording(true)
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Failed to start recognition:', e)
        setError('Failed to start recording. Please try again.')
      }
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    setShowDone(true)
    setTimeout(() => setShowDone(false), 1500)
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
    }
  }

  const clearAll = () => {
    setTranscript('')
    setInterimTranscript('')
    setWordBubbles([])
    lastFinalRef.current = ''
    setError(null)
    setShowDone(false)
  }

  const generateCard = () => {
    if (!transcript.trim()) {
      alert('Please record a message first!')
      return
    }

    // Show upgrade modal if on free tier and they want more
    if (selectedTier === 'free') {
      setShowUpgradeModal(true)
    }

    setIsGenerating(true)
    
    // Simulate card generation
    setTimeout(() => {
      // Generate a unique card ID
      const id = Math.random().toString(36).substring(2, 10)
      setCardId(id)
      setGeneratedCard({
        text: transcript.trim(),
        audioUrl: '',
        tier: selectedTier
      })
      setIsGenerating(false)
    }, 1500)
  }

  const resetAndRecordAgain = () => {
    setTranscript('')
    setInterimTranscript('')
    setGeneratedCard(null)
    setCardId('')
    setWordBubbles([])
    lastFinalRef.current = ''
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
              {/* Tier Badge */}
              {generatedCard.tier !== 'free' && (
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                  {TIERS[generatedCard.tier as keyof typeof TIERS]?.name || 'Pro'}
                </div>
              )}
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

      {/* Tier Selector */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 py-3 px-4">
        <div className="max-w-2xl mx-auto flex justify-center gap-3">
          {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((tierKey) => {
            const tier = TIERS[tierKey]
            const isSelected = selectedTier === tierKey
            return (
              <button
                key={tierKey}
                onClick={() => setSelectedTier(tierKey)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  isSelected 
                    ? tierKey === 'free' ? 'bg-gray-800 text-white' 
                    : tierKey === 'pro' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tier.name} - ${tier.price}
              </button>
            )
          })}
        </div>
        <p className="text-center text-gray-500 text-xs mt-2">
          {TIERS[selectedTier].duration} • {TIERS[selectedTier].features[0]}
        </p>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unlock More Magic ✨</h3>
            <p className="text-gray-600 mb-4">Upgrade to get enhanced animations and longer videos!</p>
            <div className="space-y-2 mb-4">
              {(Object.keys(TIERS) as Array<keyof typeof TIERS>).filter(t => t !== 'free').map((tierKey) => {
                const tier = TIERS[tierKey]
                return (
                  <button
                    key={tierKey}
                    onClick={() => {
                      setSelectedTier(tierKey)
                      setShowUpgradeModal(false)
                    }}
                    className="w-full p-3 rounded-lg border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{tier.name}</span>
                      <span className="font-bold text-pink-600">${tier.price}</span>
                    </div>
                    <p className="text-sm text-gray-500">{tier.duration}</p>
                  </button>
                )
              })}
            </div>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full text-gray-500 text-sm py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

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

        {/* Card Preview with Word Bubbles */}
        <div className={`w-64 h-40 bg-gradient-to-br ${selectedTheme.bg} rounded-2xl p-4 shadow-lg mb-8 flex items-center justify-center relative overflow-hidden`}>
          {/* Pulsing emoji when recording */}
          <span className={`text-5xl transition-transform ${isRecording ? 'animate-pulse scale-110' : ''}`}>
            {selectedTheme.emoji}
          </span>
          
          {/* Word bubbles overlay */}
          <div className="absolute inset-0 p-2 flex flex-wrap content-center justify-center gap-1 items-center">
            {wordBubbles.map((word, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700 shadow-sm animate-bounce-in"
                style={{
                  animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Recording Area */}
        <div className="w-full max-w-md">
          {/* Transcript Display */}
          <div className="bg-white rounded-2xl p-4 mb-4 min-h-[100px] shadow-inner">
            <p className="text-gray-800 whitespace-pre-wrap">
              {transcript}
              <span className="text-gray-400">{interimTranscript}</span>
              {!transcript && !interimTranscript && (
                <span className="text-gray-400 italic">
                  {isRecording ? 'Listening...' : 'Press the button and start talking...'}
                </span>
              )}
            </p>
          </div>

          {/* Record Button with Status */}
          <div className="flex flex-col items-center">
            {/* Status Badge */}
            <div className="mb-3 flex items-center gap-2">
              {isRecording ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  🔴 Listening…
                </span>
              ) : showDone ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Done
                </span>
              ) : null}
            </div>

            {/* Record Button */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={(e) => { e.preventDefault(); startRecording() }}
              onTouchEnd={(e) => { e.preventDefault(); stopRecording() }}
              disabled={!browserSupported}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl relative ${
                isRecording 
                  ? 'bg-red-500 scale-90' 
                  : 'bg-gradient-to-br from-pink-500 to-purple-600 hover:scale-105'
              } ${!browserSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Pulsing ring when recording */}
              {isRecording && (
                <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
              )}
              <span className="text-4xl mb-1 relative z-10">{isRecording ? '⏹️' : '🎤'}</span>
            </button>
            
            <p className="text-gray-500 mt-2 text-sm">
              {isRecording ? 'Release to stop' : 'Hold to record'}
            </p>

            {/* Clear Button */}
            {(transcript || wordBubbles.length > 0) && !isRecording && (
              <button
                onClick={clearAll}
                className="mt-3 px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                🗑️ Clear
              </button>
            )}
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

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-bounce-in {
          animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  )
}
