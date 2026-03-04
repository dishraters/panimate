import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) {
    return [];
  }
  
  const files = fs.readdirSync(blogDir);
  
  const posts = files
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        slug: file.replace(/\.(mdx|md)$/, ''),
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        category: data.category,
        readTime: data.readTime,
        content
      } as BlogPost;
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    if (!fs.existsSync(blogDir)) {
      return null;
    }
    
    const filePath = path.join(blogDir, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(blogDir, `${slug}.md`);
      if (!fs.existsSync(mdPath)) {
        return null;
      }
    }

    const finalPath = fs.existsSync(filePath) ? filePath : path.join(blogDir, `${slug}.md`);
    const fileContent = fs.readFileSync(finalPath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      category: data.category,
      readTime: data.readTime,
      content
    } as BlogPost;
  } catch (error) {
    return null;
  }
}
