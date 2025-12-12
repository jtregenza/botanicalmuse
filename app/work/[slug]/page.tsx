import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from '@/app/styles/page.module.css'

interface PostFrontmatter {
  title: string;
  date: string;
  thumbnail: string;
  gallery: string;
  galleryImages: Array<{
    galimage: string;
    alt: string;
  }>;
}

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'work/posts');
  const filePath = path.join(postsDirectory, `${slug}.md`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'work/posts');
  
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDirectory);
  
  return files
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => ({
      slug: filename.replace('.md', ''),
    }));
}

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }
  
  const { frontmatter, content } = post;
  
  return (
    <article className={styles.post}>

      

      {frontmatter.galleryImages && frontmatter.galleryImages.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {frontmatter.thumbnail && (
                    <div className={styles.imageCage}>
                    <Image	
                      src={frontmatter.thumbnail}
                      alt={frontmatter.title}
                      className={styles.postImage}
                width={800}
                  height={600}
                    />
                   </div>
      )}
            {frontmatter.galleryImages.map((image, index) => (
              <div className={styles.imageCage} key={index}>
              <Image
                src={image.galimage}
                alt={image.alt}
                className={styles.postImage}
                width={800}
                  height={600}
              />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={styles.postInfo}>
        <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
        <time className="text-gray-600">
          {new Date(frontmatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>
      <div className="prose prose-lg max-w-none mb-12">
        <MDXRemote source={content} />
      </div>
      </div>
    </article>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.frontmatter.title,
    description: `Art Work post: ${post.frontmatter.title}`,
  };
}