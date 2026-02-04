/**
 * Post adapter utilities to map existing data to AstroPaper format
 * Allows existing posts to work without modification
 */

import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

/**
 * Get the publication datetime, preferring AstroPaper field if available
 */
export function getPubDatetime(post: BlogPost): Date {
  return post.data.pubDatetime ?? post.data.pubDate;
}

/**
 * Get the modification datetime
 */
export function getModDatetime(post: BlogPost): Date | null | undefined {
  return post.data.modDatetime ?? post.data.updatedDate;
}

/**
 * Get tags array, converting category to tags if needed
 */
export function getTags(post: BlogPost): string[] {
  if (post.data.tags && post.data.tags.length > 0) {
    return post.data.tags;
  }
  // Convert category to single-element tags array
  if (post.data.category) {
    return [post.data.category];
  }
  return [];
}

/**
 * Get OG image, preferring AstroPaper field if available
 */
export function getOgImage(post: BlogPost): string | undefined {
  if (post.data.ogImage) {
    return typeof post.data.ogImage === "string"
      ? post.data.ogImage
      : post.data.ogImage.src;
  }
  return post.data.heroImage;
}

/**
 * Check if a post should be filtered out (draft or future scheduled)
 */
export function shouldShowPost(post: BlogPost): boolean {
  // Filter out drafts
  if (post.data.draft) {
    return false;
  }
  // In production, filter out future posts
  if (import.meta.env.PROD) {
    const pubDate = getPubDatetime(post);
    return pubDate.getTime() <= Date.now();
  }
  return true;
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = getModDatetime(a) ?? getPubDatetime(a);
    const dateB = getModDatetime(b) ?? getPubDatetime(b);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get sorted and filtered posts
 */
export function getSortedPosts(posts: BlogPost[]): BlogPost[] {
  return sortPostsByDate(posts.filter(shouldShowPost));
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return getSortedPosts(posts).filter(post => post.data.featured);
}

/**
 * Get unique categories from posts
 */
export function getUniqueCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>();
  posts.forEach(post => {
    if (post.data.category) {
      categories.add(post.data.category);
    }
    post.data.tags?.forEach(tag => categories.add(tag));
  });
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

/**
 * Get posts grouped by year
 */
export function getPostsByYear(posts: BlogPost[]): Record<number, BlogPost[]> {
  return posts.reduce((acc, post) => {
    const year = getPubDatetime(post).getFullYear();
    (acc[year] ??= []).push(post);
    return acc;
  }, {} as Record<number, BlogPost[]>);
}
