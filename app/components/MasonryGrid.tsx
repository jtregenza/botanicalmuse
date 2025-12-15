'use client';

import Image from "next/image";
import styles from "../styles/page.module.css"
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PostFrontmatter {
  title: string;
  date: string;
  thumbnail: string;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

interface HomeProps {
  posts: Post[];
}

function distributeIntoColumns(posts: Post[], columnCount: number): Post[][] {
  const columns: Post[][] = Array.from({ length: columnCount }, () => []);
  
  posts.forEach((post, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(post);
  });
  
  return columns;
}

function MasonryGrid({ posts }: HomeProps) {
  const [columns, setColumns] = useState<Post[][]>([]);
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumnCount = 3;
      
      if (width < 640) {
        newColumnCount = 1;
      } else if (width < 1024) {
        newColumnCount = 2;
      }
      
      setColumnCount(newColumnCount);
      setColumns(distributeIntoColumns(posts, newColumnCount));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [posts]);

  if (posts.length === 0) {
    return <p className={styles.emptyState}>No posts found.</p>;
  }

  return (
    <div className={styles.masonryGrid}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.masonryColumn}>
          {column.map((post) => (
            <Link
              key={post.slug}
              href={`/work/${post.slug}`}
              className={styles.masonryItem}
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
              
              <div className={styles.masonryContent}>
                <h2 className={styles.masonryTitle}>
                  {post.frontmatter.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MasonryGrid;