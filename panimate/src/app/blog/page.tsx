// Blog index page
import Link from 'next/link';

const blogPosts = [
  {
    slug: 'how-to-create-animated-video-from-voice',
    title: 'How to Create Animated Videos from Voice: Complete 2026 Guide',
    excerpt: 'Learn how to create animated videos from voice recordings. This step-by-step guide covers free and paid tools, best practices, and tips for professional results.',
    date: 'March 3, 2026',
    category: 'AI Animation',
    readTime: '7 min read'
  },
  {
    slug: 'best-ai-animated-greeting-cards',
    title: 'Best AI Animated Greeting Cards in 2026: Compared & Reviewed',
    excerpt: 'Discover the best AI animated greeting card platforms. Compare features, pricing, and quality to find the perfect tool for creating personalized animated cards.',
    date: 'March 3, 2026',
    category: 'Gift Ideas',
    readTime: '6 min read'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Panimate
              </h1>
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-pink-500 font-medium">Home</Link>
            <Link href="/blog" className="text-pink-500 font-medium">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📝 Panimate Blog
          </h1>
          <p className="text-xl text-gray-600">
            Latest guides, tips, and insights on AI animation and personalized greeting cards
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-800 hover:text-pink-500 transition-colors mb-3">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-pink-500 font-medium hover:gap-3 transition-all"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
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
