// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findStyleIssues } from './style-guard';

const projectRoot = process.cwd();
const scannedFolders = ['src/', 'content/'];
const scannedExtensions = /\.(ts|tsx|css|mdx)$/;
const testFile = /\.test\.(ts|tsx)$/;
const tokenFile = 'src/app/globals.css';

describe('findStyleIssues', () => {
  it('flags a hex colour', () => {
    for (const text of ['text-[#fff]', 'color: #1E1B18;', 'fill="#C8321E"', 'border #ccc solid']) {
      expect(findStyleIssues(text), text).not.toHaveLength(0);
    }
  });

  it('flags an arbitrary Tailwind value', () => {
    for (const text of ['p-[13px]', 'bg-[#fff]', 'w-[calc(100%-2rem)]', 'data-[state=open]:p-[13px]']) {
      expect(findStyleIssues(text), text).not.toHaveLength(0);
    }
  });

  it('flags an arbitrary property', () => {
    expect(findStyleIssues('class="[mask-type:alpha]"')).not.toHaveLength(0);
  });

  it('does not flag anchors, entities, arbitrary variants or token utilities', () => {
    const allowed = [
      'href="#main-content"',
      '&#169; 2026',
      'aria-[current=page]:underline',
      'data-[state=open]:p-8',
      'p-8 rotate-1 bg-paper text-ink',
      'interface Props { [key: string]: number }',
    ];

    for (const text of allowed) {
      expect(findStyleIssues(text), text).toEqual([]);
    }
  });
});

describe('the project files', () => {
  it('use no hard-coded colour or arbitrary Tailwind value outside globals.css', () => {
    const listing = execFileSync(
      'git',
      ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
      { cwd: projectRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    const paths = listing
      .split('\0')
      .filter((path) => scannedFolders.some((folder) => path.startsWith(folder)))
      .filter((path) => scannedExtensions.test(path) && !testFile.test(path) && path !== tokenFile);
    const problems: string[] = [];
    let scanned = 0;

    for (const path of paths) {
      let content: string;
      try {
        content = readFileSync(join(projectRoot, path), 'utf8');
      } catch {
        continue;
      }
      scanned += 1;
      for (const match of findStyleIssues(content)) {
        problems.push(`${path}: ${match}`);
      }
    }

    expect(scanned).toBeGreaterThan(0);
    expect(problems, problems.join('\n')).toEqual([]);
  });
});
