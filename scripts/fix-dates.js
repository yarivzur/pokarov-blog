#!/usr/bin/env node
/**
 * Fix Tripod Blog Post Dates
 *
 * This script analyzes and fixes date mismatches in tripod blog posts.
 * The frontmatter dates are often placeholders (YYYY-01-01) while the
 * actual dates are embedded in the content as **Day, DD Month YYYY**.
 *
 * Usage:
 *   node scripts/fix-dates.js analyze   # Report mismatches without changing files
 *   node scripts/fix-dates.js fix       # Fix mismatches and remove date lines from content
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

const BLOG_DIR = './src/content/blog';

// Month name to number mapping
const MONTHS = {
  'january': '01',
  'february': '02',
  'march': '03',
  'april': '04',
  'may': '05',
  'june': '06',
  'july': '07',
  'august': '08',
  'september': '09',
  'october': '10',
  'november': '11',
  'december': '12'
};

// Pattern: **Day, DD Month YYYY**
const DATE_PATTERN = /\*\*\w+,\s+(\d{1,2})\s+(\w+)\s+(\d{4})\*\*/;

/**
 * Parse the date from content body
 * @param {string} content - Full file content
 * @returns {{ date: string | null, line: string | null }} - ISO date string and the matched line
 */
function parseContentDate(content) {
  const match = content.match(DATE_PATTERN);
  if (!match) {
    return { date: null, line: null };
  }

  const day = match[1].padStart(2, '0');
  const monthName = match[2].toLowerCase();
  const year = match[3];
  const month = MONTHS[monthName];

  if (!month) {
    console.error(`Unknown month: ${match[2]}`);
    return { date: null, line: null };
  }

  return {
    date: `${year}-${month}-${day}`,
    line: match[0]
  };
}

/**
 * Extract frontmatter pubDate from file content
 * @param {string} content - Full file content
 * @returns {string | null} - The pubDate value or null
 */
function parseFrontmatterDate(content) {
  const match = content.match(/pubDate:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Check if a date looks like a placeholder (day is 01)
 * @param {string} date - ISO date string YYYY-MM-DD
 * @returns {boolean}
 */
function isPlaceholderDate(date) {
  if (!date) return false;
  // Placeholder dates typically have -01 for the day
  return date.endsWith('-01');
}

/**
 * Update the frontmatter date in content
 * @param {string} content - Full file content
 * @param {string} oldDate - Current pubDate
 * @param {string} newDate - New pubDate
 * @returns {string} - Updated content
 */
function updateFrontmatterDate(content, oldDate, newDate) {
  return content.replace(
    `pubDate: "${oldDate}"`,
    `pubDate: "${newDate}"`
  );
}

/**
 * Remove the date line from content body
 * @param {string} content - Full file content
 * @param {string} dateLine - The date line to remove (e.g., **Fri, 07 March 2003**)
 * @returns {string} - Content with date line removed
 */
function removeDateLine(content, dateLine) {
  // Remove the date line and any surrounding empty lines
  // The pattern captures the line with potential surrounding newlines
  const escapedLine = dateLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\n*${escapedLine}\\n*`, 'g');
  return content.replace(pattern, '\n\n');
}

/**
 * Process all tripod files
 * @param {boolean} dryRun - If true, only analyze without making changes
 */
async function processFiles(dryRun = true) {
  const files = await readdir(BLOG_DIR);
  const tripodFiles = files.filter(f => f.startsWith('tripod-') && f.endsWith('.md'));

  console.log(`Found ${tripodFiles.length} tripod files\n`);

  const stats = {
    total: tripodFiles.length,
    withContentDate: 0,
    mismatches: 0,
    fixed: 0,
    noContentDate: 0,
    alreadyCorrect: 0
  };

  const mismatches = [];

  for (const file of tripodFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');

    const frontmatterDate = parseFrontmatterDate(content);
    const { date: contentDate, line: dateLine } = parseContentDate(content);

    if (!contentDate) {
      stats.noContentDate++;
      continue;
    }

    stats.withContentDate++;

    if (frontmatterDate === contentDate) {
      stats.alreadyCorrect++;
      continue;
    }

    stats.mismatches++;
    mismatches.push({
      file,
      frontmatterDate,
      contentDate,
      dateLine,
      isPlaceholder: isPlaceholderDate(frontmatterDate)
    });

    if (!dryRun) {
      let updatedContent = content;

      // Update frontmatter date
      updatedContent = updateFrontmatterDate(updatedContent, frontmatterDate, contentDate);

      // Remove the date line from content body
      updatedContent = removeDateLine(updatedContent, dateLine);

      await writeFile(filePath, updatedContent, 'utf-8');
      stats.fixed++;
    }
  }

  // Print results
  console.log('='.repeat(60));
  console.log(dryRun ? 'ANALYSIS REPORT' : 'FIX REPORT');
  console.log('='.repeat(60));
  console.log(`Total tripod files:      ${stats.total}`);
  console.log(`Files with content date: ${stats.withContentDate}`);
  console.log(`Files without date:      ${stats.noContentDate}`);
  console.log(`Already correct:         ${stats.alreadyCorrect}`);
  console.log(`Mismatches found:        ${stats.mismatches}`);
  if (!dryRun) {
    console.log(`Files fixed:             ${stats.fixed}`);
  }
  console.log('='.repeat(60));

  if (dryRun && mismatches.length > 0) {
    console.log('\nMISMATCHED FILES:');
    console.log('-'.repeat(60));

    // Show first 20 mismatches in detail
    const toShow = mismatches.slice(0, 20);
    for (const m of toShow) {
      console.log(`\n${m.file}`);
      console.log(`  Frontmatter: ${m.frontmatterDate}${m.isPlaceholder ? ' (placeholder)' : ''}`);
      console.log(`  Content:     ${m.contentDate}`);
      console.log(`  Status:      MISMATCH`);
    }

    if (mismatches.length > 20) {
      console.log(`\n... and ${mismatches.length - 20} more mismatches`);
    }
  }

  return stats;
}

// Main entry point
const mode = process.argv[2];

if (!mode || !['analyze', 'fix'].includes(mode)) {
  console.log('Usage:');
  console.log('  node scripts/fix-dates.js analyze   # Report mismatches');
  console.log('  node scripts/fix-dates.js fix       # Fix mismatches');
  process.exit(1);
}

const dryRun = mode === 'analyze';
console.log(`Mode: ${dryRun ? 'ANALYZE (dry run)' : 'FIX (making changes)'}\n`);

processFiles(dryRun)
  .then(stats => {
    if (dryRun && stats.mismatches > 0) {
      console.log(`\nRun 'node scripts/fix-dates.js fix' to apply changes.`);
    }
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
