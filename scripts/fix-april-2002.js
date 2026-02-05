#!/usr/bin/env node
/**
 * Fix files incorrectly assigned April 13, 2002
 *
 * These files have "**Sat, 13 April 2002**" embedded (archive date),
 * but the real dates are in the title or filename.
 *
 * Title pattern: "MM.DD.YYYY" (e.g., "06.20.1999")
 * Filename pattern: "tripod-YYYY-01-01-MM-DD-YYYY.md"
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BLOG_DIR = './src/content/blog';

/**
 * Parse date from title like "06.20.1999" or "07.22.2001"
 * @param {string} title
 * @returns {string | null} ISO date YYYY-MM-DD
 */
function parseTitleDate(title) {
  // Pattern: MM.DD.YYYY
  const match = title.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

/**
 * Parse date from filename like "tripod-2001-01-01-07-22-2001.md"
 * @param {string} filename
 * @returns {string | null} ISO date YYYY-MM-DD
 */
function parseFilenameDate(filename) {
  // Pattern: tripod-YYYY-01-01-MM-DD-YYYY.md
  const match = filename.match(/tripod-\d{4}-\d{2}-\d{2}-(\d{2})-(\d{2})-(\d{4})\.md$/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

/**
 * Extract title from frontmatter
 * @param {string} content
 * @returns {string | null}
 */
function extractTitle(content) {
  const match = content.match(/title:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Extract pubDate from frontmatter
 * @param {string} content
 * @returns {string | null}
 */
function extractPubDate(content) {
  const match = content.match(/pubDate:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Update pubDate in frontmatter
 * @param {string} content
 * @param {string} oldDate
 * @param {string} newDate
 * @returns {string}
 */
function updatePubDate(content, oldDate, newDate) {
  return content.replace(
    `pubDate: "${oldDate}"`,
    `pubDate: "${newDate}"`
  );
}

async function main() {
  const files = await readdir(BLOG_DIR);
  const tripodFiles = files.filter(f => f.startsWith('tripod-') && f.endsWith('.md'));

  const stats = {
    checked: 0,
    april2002: 0,
    fixedFromTitle: 0,
    fixedFromFilename: 0,
    couldNotFix: []
  };

  console.log('Scanning for files with pubDate 2002-04-13...\n');

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

    // Try to get date from title first
    if (title) {
      newDate = parseTitleDate(title);
      if (newDate) {
        source = 'title';
      }
    }

    // If not found in title, try filename
    if (!newDate) {
      newDate = parseFilenameDate(file);
      if (newDate) {
        source = 'filename';
      }
    }

    if (newDate) {
      const updatedContent = updatePubDate(content, pubDate, newDate);
      await writeFile(filePath, updatedContent, 'utf-8');

      if (source === 'title') {
        stats.fixedFromTitle++;
      } else {
        stats.fixedFromFilename++;
      }

      console.log(`Fixed: ${file}`);
      console.log(`  ${pubDate} -> ${newDate} (from ${source})`);
    } else {
      stats.couldNotFix.push({ file, title });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files checked:        ${stats.checked}`);
  console.log(`Had April 13, 2002:   ${stats.april2002}`);
  console.log(`Fixed from title:     ${stats.fixedFromTitle}`);
  console.log(`Fixed from filename:  ${stats.fixedFromFilename}`);
  console.log(`Could not fix:        ${stats.couldNotFix.length}`);
  console.log('='.repeat(60));

  if (stats.couldNotFix.length > 0) {
    console.log('\nFiles that could not be fixed (no date in title/filename):');
    for (const { file, title } of stats.couldNotFix) {
      console.log(`  ${file}`);
      console.log(`    title: "${title}"`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
