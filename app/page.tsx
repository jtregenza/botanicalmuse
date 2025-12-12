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
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        slug: filename.replace('.md', ''),
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
    <div className={styles.homeGallery}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/work/${post.slug}`}
          
          >
            {post.frontmatter.thumbnail && (
              <div className={styles.imageCage}>
                <Image
                loading="eager"
                className={styles.homeImage}
                width={800}
                  height={600}
                  src={post.frontmatter.thumbnail}
                  alt={post.frontmatter.title}
                  
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.frontmatter.title}
              </h2>
            </div>
          </Link>
        ))}
      
      {posts.length === 0 && (
        <p className="text-gray-600 text-center py-12">No posts found.</p>
      )}
    </div>
  );
}
