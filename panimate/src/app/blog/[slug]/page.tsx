// Individual blog post page
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

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

      {/* Article */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-pink-500 font-medium mb-8">
            ← Back to Blog
          </Link>
          
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-8 pb-8 border-b border-pink-100">
            {post.excerpt}
          </p>
          
          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-600">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-600 mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-600" {...props} />,
                table: ({node, ...props}) => <table className="w-full border-collapse border border-gray-300 mb-4" {...props} />,
                tr: ({node, ...props}) => <tr className="border border-gray-300" {...props} />,
                th: ({node, ...props}) => <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left" {...props} />,
                td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              🎁 Create a Personalized Animated Greeting Card
            </h3>
            <p className="text-white/90 mb-6">
              Use YOUR voice to create a gift they'll treasure forever. Try it free!
            </p>
            <Link 
              href="/" 
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Start Creating Free →
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center mt-12">
        <p className="text-gray-400">
          © 2026 Panimate. All rights reserved. • Made with 💜
        </p>
      </footer>
    </div>
  );
}
