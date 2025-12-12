// app/posts/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

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
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), '/work/posts');
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), '/work/posts');
  const files = fs.readdirSync(postsDirectory);
  
  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

export default async function Post({ params }: PostProps) {
  const { frontmatter, content } = await getPost(params.slug);
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
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
      
      {frontmatter.thumbnail && (
        <Image
          src={frontmatter.thumbnail}
          alt={frontmatter.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <div className="prose prose-lg max-w-none mb-12">
        <MDXRemote source={content} />
      </div>
      
      {frontmatter.galleryImages && frontmatter.galleryImages.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frontmatter.galleryImages.map((image, index) => (
              <Image
                key={index}
                src={image.galimage}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}