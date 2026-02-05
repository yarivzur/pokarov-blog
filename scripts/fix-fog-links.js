#!/usr/bin/env node
/**
 * Fix broken fog*.html links in blog posts
 *
 * - Links where target exists: Convert to /blog/[slug] URLs
 * - Links where target is missing: Remove link, keep text
 * - Handles anchor links (e.g., fog0000000071.html#Options)
 *
 * Usage:
 *   node scripts/fix-fog-links.js analyze   # Report without changes
 *   node scripts/fix-fog-links.js fix       # Apply fixes
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BLOG_DIR = './src/content/blog';

/**
 * Build mapping from fog ID to post slug
 */
async function buildFogMapping(files) {
  const fogToSlug = new Map();

  for (const file of files) {
    const content = await readFile(join(BLOG_DIR, file), 'utf-8');
    const match = content.match(/original_file:.*?(fog\d+)\.html/);
    if (match) {
      const slug = file.replace('.md', '');
      fogToSlug.set(match[1], slug);
    }
  }

  return fogToSlug;
}

/**
 * Fix fog links in a single file
 * @returns {{ fixed: number, removed: number, content: string }}
 */
function fixFogLinks(content, fogToSlug, currentSlug) {
  let fixed = 0;
  let removed = 0;

  // Pattern to match markdown links with fog URLs
  // Captures: [link text](path/to/fog0000000XX.html#anchor)
  const linkPattern = /\[([^\]]*)\]\(([^)]*?)(fog\d+)\.html(#[^)]*)?\)/g;

  const newContent = content.replace(linkPattern, (match, linkText, pathPrefix, fogId, anchor) => {
    anchor = anchor || '';

    if (fogToSlug.has(fogId)) {
      const targetSlug = fogToSlug.get(fogId);

      // Check if linking to self (same post)
      if (targetSlug === currentSlug && anchor) {
        // Internal anchor link - just use the anchor
        fixed++;
        return `[${linkText}](${anchor})`;
      } else {
        // Link to another post
        fixed++;
        return `[${linkText}](/blog/${targetSlug}/${anchor})`;
      }
    } else {
      // Target doesn't exist - remove link, keep text
      removed++;
      return linkText;
    }
  });

  return { fixed, removed, content: newContent };
}

async function main() {
  const mode = process.argv[2];

  if (!mode || !['analyze', 'fix'].includes(mode)) {
    console.log('Usage:');
    console.log('  node scripts/fix-fog-links.js analyze   # Report without changes');
    console.log('  node scripts/fix-fog-links.js fix       # Apply fixes');
    process.exit(1);
  }

  const dryRun = mode === 'analyze';
  console.log(`Mode: ${dryRun ? 'ANALYZE (dry run)' : 'FIX (making changes)'}\n`);

  const files = await readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  // Build fog ID -> slug mapping
  const fogToSlug = await buildFogMapping(mdFiles);
  console.log(`Found ${fogToSlug.size} posts with fog IDs\n`);

  const stats = {
    filesChecked: 0,
    filesModified: 0,
    linksFixed: 0,
    linksRemoved: 0
  };

  const modifications = [];

  for (const file of mdFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const currentSlug = file.replace('.md', '');

    stats.filesChecked++;

    // Check if file has any fog links
    if (!content.includes('fog') || !content.match(/fog\d+\.html/)) {
      continue;
    }

    const result = fixFogLinks(content, fogToSlug, currentSlug);

    if (result.fixed > 0 || result.removed > 0) {
      stats.filesModified++;
      stats.linksFixed += result.fixed;
      stats.linksRemoved += result.removed;

      modifications.push({
        file,
        fixed: result.fixed,
        removed: result.removed
      });

      if (!dryRun) {
        await writeFile(filePath, result.content, 'utf-8');
      }
    }
  }

  // Print results
  console.log('='.repeat(60));
  console.log(dryRun ? 'ANALYSIS REPORT' : 'FIX REPORT');
  console.log('='.repeat(60));
  console.log(`Files checked:    ${stats.filesChecked}`);
  console.log(`Files modified:   ${stats.filesModified}`);
  console.log(`Links fixed:      ${stats.linksFixed}`);
  console.log(`Links removed:    ${stats.linksRemoved}`);
  console.log('='.repeat(60));

  if (modifications.length > 0) {
    console.log('\nModified files:');
    for (const mod of modifications) {
      console.log(`  ${mod.file}`);
      console.log(`    Fixed: ${mod.fixed}, Removed: ${mod.removed}`);
    }
  }

  if (dryRun && (stats.linksFixed > 0 || stats.linksRemoved > 0)) {
    console.log(`\nRun 'node scripts/fix-fog-links.js fix' to apply changes.`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
