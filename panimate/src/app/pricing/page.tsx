'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, amount?: number) => {
    setLoading(priceId || 'custom');
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          customAmount: amount,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Payment system not ready yet');
    }
    
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Panimate
            </h1>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-gray-600 hover:text-purple-500">Home</Link>
            <Link href="/create" className="text-gray-600 hover:text-purple-500">Create</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Create Magical Animated Cards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One-time payments or subscription. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-800 mb-1">$0</div>
              <p className="text-gray-500 text-sm mb-6">forever</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> 1 card per month
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Basic templates
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Standard quality
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-400">✗</span> No custom photos
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-400">✗</span> No HD export
              </li>
            </ul>
            <Link 
              href="/create"
              className="block w-full py-3 text-center border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:border-purple-500 hover:text-purple-500 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white transform scale-105">
            <div className="text-center">
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-2">MOST POPULAR</span>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-1">$9<span className="text-lg font-normal">/mo</span></div>
              <p className="text-white/80 text-sm mb-6">or $5/card one-time</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-white">✓</span> Unlimited cards
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">✓</span> All templates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">✓</span> Custom photos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">✓</span> HD export
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">✓</span> Priority rendering
              </li>
            </ul>
            <button 
              onClick={() => handleSubscribe('price_pro_monthly')}
              disabled={loading === 'price_pro_monthly'}
              className="block w-full py-3 text-center bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {loading === 'price_pro_monthly' ? 'Processing...' : 'Start Pro →'}
            </button>
          </div>

          {/* Custom Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Card</h3>
              <div className="text-4xl font-bold text-gray-800 mb-1">$15</div>
              <p className="text-gray-500 text-sm mb-6">one-time</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> We make it for you
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Your photos + words
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Ultra HD quality
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Fast turnaround
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Commercial license
              </li>
            </ul>
            <button 
              onClick={() => handleSubscribe(null, 15)}
              disabled={loading === 'custom'}
              className="block w-full py-3 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading === 'custom' ? 'Processing...' : 'Order Custom →'}
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            Questions? <a href="mailto:hello@panimate.app" className="text-purple-500 hover:underline">Email us</a>
          </p>
        </div>
      </main>
    </div>
  );
}
