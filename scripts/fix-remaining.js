#!/usr/bin/env node
/**
 * Fix remaining files that still have April 13, 2002
 *
 * For files without date in title, extract year from filename
 * and use YYYY-01-01 as placeholder (better than wrong 2002-04-13)
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BLOG_DIR = './src/content/blog';

/**
 * Extract pubDate from frontmatter
 */
function extractPubDate(content) {
  const match = content.match(/pubDate:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Extract title from frontmatter
 */
function extractTitle(content) {
  const match = content.match(/title:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Update pubDate in frontmatter
 */
function updatePubDate(content, oldDate, newDate) {
  return content.replace(
    `pubDate: "${oldDate}"`,
    `pubDate: "${newDate}"`
  );
}

/**
 * Parse date from title like "03.18.2001-2" (variant with suffix)
 */
function parseTitleDateVariant(title) {
  const match = title.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

/**
 * Extract year from filename like "tripod-1999-01-01-xxx.md"
 * Returns YYYY-01-01 as a year-based placeholder
 */
function getYearPlaceholder(filename) {
  const match = filename.match(/tripod-(\d{4})-\d{2}-\d{2}/);
  if (match) {
    return `${match[1]}-01-01`;
  }
  return null;
}

async function main() {
  const files = await readdir(BLOG_DIR);
  const tripodFiles = files.filter(f => f.startsWith('tripod-') && f.endsWith('.md'));

  const stats = {
    checked: 0,
    april2002: 0,
    fixedFromTitle: 0,
    fixedToPlaceholder: 0
  };

  console.log('Fixing remaining files with pubDate 2002-04-13...\n');

  for (const file of tripodFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const pubDate = extractPubDate(content);

    stats.checked++;

    if (pubDate !== '2002-04-13') {
      continue;
    }

    stats.april2002++;

    const title = extractTitle(content);
    let newDate = null;
    let source = '';

    // Try title with variant pattern (e.g., "03.18.2001-2")
    if (title) {
      newDate = parseTitleDateVariant(title);
      if (newDate) {
        source = 'title (variant)';
      }
    }

    // Fall back to year placeholder from filename
    if (!newDate) {
      newDate = getYearPlaceholder(file);
      if (newDate) {
        source = 'filename year placeholder';
      }
    }

    if (newDate) {
      const updatedContent = updatePubDate(content, pubDate, newDate);
      await writeFile(filePath, updatedContent, 'utf-8');

      if (source.includes('title')) {
        stats.fixedFromTitle++;
      } else {
        stats.fixedToPlaceholder++;
      }

      console.log(`Fixed: ${file}`);
      console.log(`  ${pubDate} -> ${newDate} (${source})`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files checked:          ${stats.checked}`);
  console.log(`Still had April 2002:   ${stats.april2002}`);
  console.log(`Fixed from title:       ${stats.fixedFromTitle}`);
  console.log(`Fixed to placeholder:   ${stats.fixedToPlaceholder}`);
  console.log('='.repeat(60));

  // Verify none left
  let remaining = 0;
  for (const file of tripodFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    if (extractPubDate(content) === '2002-04-13') {
      remaining++;
    }
  }
  console.log(`\nFiles still with 2002-04-13: ${remaining}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
