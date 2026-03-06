'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

// Use Lottie player - import directly
import { Player } from '@lottiefiles/react-lottie-player'

// Card themes
const THEMES = [
  { id: 'mom', emoji: '🌸', name: 'Mom', color: '#ec4899', bg: 'from-pink-300 to-purple-400', text: 'Happy Mother\'s Day!' },
  { id: 'dad', emoji: '🎉', name: 'Dad', color: '#3b82f6', bg: 'from-blue-400 to-cyan-300', text: 'Happy Father\'s Day!' },
  { id: 'love', emoji: '💕', name: 'Love', color: '#f43f5e', bg: 'from-rose-400 to-pink-400', text: 'I Love You!' },
  { id: 'birthday', emoji: '🎂', name: 'Birthday', color: '#f59e0b', bg: 'from-yellow-400 to-orange-400', text: 'Happy Birthday!' },
  { id: 'thanks', emoji: '🙏', name: 'Thanks', color: '#10b981', bg: 'from-emerald-400 to-teal-400', text: 'Thank You!' },
  { id: 'congrats', emoji: '🎊', name: 'Congrats', color: '#8b5cf6', bg: 'from-violet-400 to-purple-400', text: 'Congratulations!' },
]

// Mock card data (in production, this would come from a database)
const MOCK_CARDS: Record<string, { text: string; themeId: string }> = {
  'test123': { text: 'Mom, you are the best mother in the world! Thank you for everything you do. I love you so much!', themeId: 'mom' },
  'abc123': { text: 'Happy Birthday! Wishing you an amazing day filled with joy and laughter.', themeId: 'birthday' },
}

export default function CardPage() {
  const params = useParams()
  const router = useRouter()
  const cardId = params.id as string
  
  const [cardData, setCardData] = useState<{text: string; themeId: string; animations?: string[]; tier?: string} | null>(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(THEMES[0])

  useEffect(() => {
    async function fetchCard() {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('cards')
        .select('transcript, category, animations, tier')
        .eq('id', cardId)
        .single()
      
      if (data && !error) {
        setCardData({
          text: data.transcript,
          themeId: data.category,
          animations: data.animations,
          tier: data.tier
        })
        const foundTheme = THEMES.find(t => t.id === data.category) || THEMES[0]
        setTheme(foundTheme)
      } else {
        // Fallback to mock data for demo
        const mockData = MOCK_CARDS[cardId]
        if (mockData) {
          setCardData(mockData)
          const foundTheme = THEMES.find(t => t.id === mockData.themeId) || THEMES[0]
          setTheme(foundTheme)
        } else {
          // Demo card for unknown IDs
          setCardData({ text: 'This is a demo card! Create your own voice card at Panimate.', themeId: 'love' })
          setTheme(THEMES[2])
        }
      }
      setLoading(false)
    }
    
    fetchCard()
  }, [cardId])

  // Check if this is a Pro card with animations
  const isPro = cardData?.tier === 'pro' || cardData?.tier === 'premium'
  const hasAnimations = cardData?.animations && cardData.animations.length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-2xl">Loading card...</div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Card not found</p>
          <button 
            onClick={() => router.push('/create')}
            className="text-pink-500 underline"
          >
            Create your own card
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col">
      {/* Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card Preview */}
          <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden`}>
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-4xl animate-pulse">{theme.emoji}</div>
            <div className="absolute top-4 right-4 text-4xl animate-pulse">✨</div>
            <div className="absolute bottom-4 left-4 text-4xl animate-pulse">💫</div>
            <div className="absolute bottom-4 right-4 text-4xl animate-pulse">{theme.emoji}</div>
            
            {/* Message */}
            <div className="relative z-10 py-8">
              <p className="text-3xl font-bold text-white drop-shadow-lg mb-4">{theme.text}</p>
              <div className="bg-white/90 rounded-2xl p-6 shadow-inner">
                <p className="text-gray-800 text-xl leading-relaxed italic">"{cardData.text}"</p>
              </div>
              {/* Celebration Animation - always show */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.3)', borderRadius: '1rem' }}>
                <Player
                  autoplay
                  loop
                  src="/animations/celebration.json"
                  style={{ width: 150, height: 150 }}
                />
              </div>
              <p className="text-white/80 text-sm mt-4">— A voice card from Panimate</p>
            </div>
          </div>

          {/* Create your own */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Make your own voice card for someone special</p>
            <button 
              onClick={() => router.push('/create')}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:opacity-90"
            >
              ✨ Create Your Own Card
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>Made with 💕 by Panimate</p>
      </footer>
    </div>
  )
}
