import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MasonryGrid from './components/MasonryGrid';

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
  return <MasonryGrid posts={posts} />;
}