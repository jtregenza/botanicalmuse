import Image from "next/image";
import styles from "./styles/page.module.css"
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface PostFrontmatter {
  title: string;
  date: string;
  thumbnail: string;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), '/work/posts');
  const files = fs.readdirSync(postsDirectory);
  
  const posts = files
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        slug: filename.replace('.mdx', ''),
        frontmatter: data as PostFrontmatter,
      };
    })
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
  
  return posts;
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
    <div >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/work/${post.slug}`}
          
          >
            {post.frontmatter.thumbnail && (
              <div className="aspect-video overflow-hidden">
                <Image
                  src={post.frontmatter.thumbnail}
                  alt={post.frontmatter.title}
                  
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.frontmatter.title}
              </h2>
              
              <time className="text-sm text-gray-600">
                {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="text-gray-600 text-center py-12">No posts found.</p>
      )}
    </>
  );
}
