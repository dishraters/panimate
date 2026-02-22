'use client';

import { useState, useEffect } from 'react';

export default function Panimate() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Calculate days until Mother's Day (May 11)
    const mothersDay = new Date('2026-05-11');
    const today = new Date();
    const diff = Math.ceil((mothersDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff > 0 ? diff : 0);
    
    const waitlist = JSON.parse(localStorage.getItem('panimate-waitlist') || '[]');
    setWaitlistCount(waitlist.length);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    const waitlist = JSON.parse(localStorage.getItem('panimate-waitlist') || '[]');
    if (!waitlist.includes(email)) {
      waitlist.push(email);
      localStorage.setItem('panimate-waitlist', JSON.stringify(waitlist));
      setWaitlistCount(waitlist.length);
    }
    
    setSubmitted(true);
  };

  // Share function
  const share = (platform: string) => {
    const url = encodeURIComponent('panimate.com');
    const text = encodeURIComponent('🎁 Make your loved one a personalized animated greeting card with their voice! Try Panimate free.');
    
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: url,
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText('panimate.com');
      alert('Link copied!');
    } else {
      window.open(links[platform], '_blank');
    }
  };

  // Smooth scroll function
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const occasions = [
    { id: 'mothers-day', label: "Mother's Day", icon: '🌸', date: 'May 11' },
    { id: 'birthday', label: 'Birthday', icon: '🎂', date: 'Any day' },
    { id: 'fathers-day', label: "Father's Day", icon: '🎁', date: 'June 15' },
    { id: 'graduation', label: 'Graduation', icon: '🎓', date: 'May/June' },
    { id: 'thank-you', label: 'Thank You', icon: '🙏', date: 'Any day' },
    { id: 'anniversary', label: 'Anniversary', icon: '💕', date: 'Any day' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Panimate
            </h1>
          </div>
          <div className="flex gap-4">
            <a href="#pricing" className="text-gray-600 hover:text-pink-500 font-medium">Pricing</a>
            <a href="#waitlist" className="bg-pink-500 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-600">Join Waitlist</a>
          </div>
        </div>
      </header>

      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-3 px-6 text-center">
        <p className="text-white font-bold">
          ⏰ {daysLeft} days until Mother's Day — Order now for guaranteed delivery! 🎁
        </p>
      </div>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-bounce">🎬</div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Your Voice, <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Brought to Life</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            🎁 The ONLY gift that uses THEIR favorite voice to deliver a personalized animated message they'll treasure forever.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => scrollTo('waitlist')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all animate-pulse"
            >
              🎁 Make Your Mother's Day Card — Free Preview
            </button>
            <button 
              onClick={() => scrollTo('how-it-works')}
              className="bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all"
            >
              See How It Works
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">🎯 Join {waitlistCount}+ people on the waitlist</p>
        </div>
      </section>

      {/* Demo Video Placeholder */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-white text-xl font-medium">Demo Video Coming Soon</p>
                <p className="text-gray-400 mt-2">See your voice become animation</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all backdrop-blur-sm">
                  <span className="text-4xl">▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section id="occasions" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Perfect for Every Occasion</h3>
          <p className="text-center text-gray-600 mb-12">Choose an occasion to personalize your card</p>
          <div className="grid md:grid-cols-3 gap-6">
            {occasions.map((occasion) => (
              <button 
                key={occasion.id}
                onClick={() => setSelectedOccasion(occasion.id)}
                className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg text-left ${
                  selectedOccasion === occasion.id ? 'border-pink-500 shadow-lg' : 'border-transparent hover:border-pink-200'
                }`}
              >
                <div className="text-4xl mb-3">{occasion.icon}</div>
                <h4 className="text-lg font-bold text-gray-800">{occasion.label}</h4>
                <p className="text-gray-500 text-sm">{occasion.date}</p>
              </button>
            ))}
          </div>
          {selectedOccasion && (
            <div className="text-center mt-8">
              <a href="#waitlist" className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-all">
                Create {occasions.find(o => o.id === selectedOccasion)?.label} Card →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Simple, Transparent Pricing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Preview */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-800 mb-2">Free Preview</h4>
              <p className="text-4xl font-bold text-gray-600 mb-4">$0</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✓ Record your voice</li>
                <li>✓ AI generates animation preview</li>
                <li>✓ 15 second preview</li>
                <li>✓ Share to social</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold">Try Free</button>
            </div>

            {/* Standard */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-6 text-white relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h4 className="text-xl font-bold mb-2">Standard Card</h4>
              <p className="text-4xl font-bold mb-4">$4.99</p>
              <ul className="text-white/90 space-y-2 mb-6">
                <li>✓ Everything in Free</li>
                <li>✓ Full 60 second animation</li>
                <li>✓ HD quality download</li>
                <li>✓ Multiple designs</li>
              </ul>
              <button className="w-full bg-white text-pink-600 py-3 rounded-lg font-bold hover:bg-gray-100">Get Standard</button>
            </div>

            {/* Premium */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-800 mb-2">Premium Bundle</h4>
              <p className="text-4xl font-bold text-gray-600 mb-4">$9.99</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✓ Everything in Standard</li>
                <li>✓ 2-minute animation</li>
                <li>✓ 4K Ultra HD</li>
                <li>✓ Priority processing</li>
                <li>✓ 5 cards for $19.99</li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">Get Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-16">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎤', title: 'Record Your Voice', desc: 'Simply speak your message. Sing happy birthday. Read a poem. Whatever you want.' },
              { icon: '🤖', title: 'AI Animates It', desc: 'Our technology transforms your voice into a unique animated character.' },
              { icon: '🎊', title: 'Send Joy', desc: 'Share the magic with family and friends. They\'ll never forget it.' }
            ].map((step, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-16">Why Panimate?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Studio-quality animation',
              'Perfect for any occasion',
              'Try before you buy',
              'Personal & unique',
              'Instant delivery',
              'Share anywhere'
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center gap-3">
                <span className="text-pink-500">✓</span>
                <span className="font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-pink-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">What People Are Saying</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "I sent one to my mom for her birthday. She cried. Best gift ever.", author: "Sarah M.", role: "Beta Tester" },
              { quote: "Finally something unique! No more generic ecards.", author: "Mike R.", role: "Early User" },
              { quote: "The kids made one for grandma. She's obsessed.", author: "Lisa K.", role: "Mom of 3" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="font-bold text-pink-600">— {testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">🎁 Give $5, Get $5</h3>
            <p className="mb-6">Invite a friend to join the waitlist and you'll both get $5 off your first card!</p>
            <div className="flex gap-2 justify-center max-w-md mx-auto">
              <input 
                type="text" 
                value={`panimate.com?ref=${email.split('@')[0] || 'friend'}`}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-sm"
                id="referralLink"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`panimate.com?ref=${email.split('@')[0] || 'friend'}`);
                  alert('Link copied! Share with friends.');
                }}
                className="bg-white text-pink-600 px-6 py-3 rounded-lg font-bold"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="py-12 px-6 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Share with Friends</h3>
          <div className="flex gap-4 justify-center">
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-all">
              📱 Facebook
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-all">
              🐦 Twitter
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-all">
              📸 Instagram
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" className="py-20 px-6 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            🎉 Mother's Day is Coming!
          </h3>
          <p className="text-white/90 text-lg mb-8">
            Be the first to know when we launch. Get a free card with your first purchase.
          </p>
          {submitted ? (
            <div className="bg-white/20 rounded-xl p-6 text-white">
              <span className="text-2xl">🎉</span>
              <p className="font-bold mt-2">You're on the list!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full text-gray-800"
                required
              />
              <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all">
                Join
              </button>
            </form>
          )}
          {waitlistCount > 0 && (
            <p className="text-white/60 text-sm mt-4">🎉 {waitlistCount} people already on the waitlist!</p>
          )}
        </div>
      </section>

      {/* Share */}
      <section className="py-12 px-6 bg-pink-50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">💝 Share with Someone You Love</h3>
          <p className="text-gray-600 mb-6">Know someone who would love Panimate? Share the magic!</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => share('twitter')} className="bg-blue-400 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-all">🐦 Twitter</button>
            <button onClick={() => share('facebook')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">📘 Facebook</button>
            <button onClick={() => share('copy')} className="bg-gray-600 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700 transition-all">📋 Copy Link</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400">
          © 2026 Panimate. All rights reserved. • Made with 💜
        </p>
      </footer>
    </div>
  );
}
