// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { APPROVED_EMAIL, findPrivacyIssues, hasPrivateIgnoreLine } from './privacy';

const projectRoot = process.cwd();
const binaryExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.pdf',
  '.woff', '.woff2', '.ttf', '.otf', '.zip', '.mp3', '.mp4',
]);

// The lockfile is machine-written base64 hashes with no personal text, and a hash could
// contain a phone-like run by chance that nobody could fix by editing the file.
const skippedFiles = new Set(['package-lock.json']);

function zeros(count: number): string {
  return '0'.repeat(count);
}

describe('findPrivacyIssues', () => {
  it('flags phone-like strings in several formats', () => {
    const plain = '09' + zeros(9);
    const spaced = ['09' + zeros(2), zeros(3), zeros(4)].join(' ');
    const dotted = ['09' + zeros(2), zeros(3), zeros(4)].join('.');
    const dashed = ['09' + zeros(2), zeros(3), zeros(4)].join('-');
    const international = '+' + '63' + '9' + '1'.repeat(9);
    const bareCountryCode = '+' + '63';
    const countryCodeNoPlus = '63' + '9' + '2'.repeat(9);

    for (const value of [plain, spaced, dotted, dashed, international, bareCountryCode, countryCodeNoPlus]) {
      expect(findPrivacyIssues(`call ${value} now`), value).not.toHaveLength(0);
    }
  });

  it('flags brackets, the 0063 prefix and numbers stuck to other characters', () => {
    const bracketed = '(' + '09' + zeros(2) + ') ' + zeros(3) + ' ' + zeros(4);
    const doubleZeroPrefix = '0063' + '9' + '3'.repeat(9);
    const doubleZeroSpaced = ['0063', '9' + '3'.repeat(2), '3'.repeat(3), '3'.repeat(4)].join(' ');
    const stuckToLetter = 'x' + '09' + zeros(9);
    const afterDash = 'tel-' + '09' + zeros(9);

    for (const value of [bracketed, doubleZeroPrefix, doubleZeroSpaced, stuckToLetter, afterDash]) {
      expect(findPrivacyIssues(`call ${value} now`), value).not.toHaveLength(0);
    }
  });

  it('treats the approved email the same in any letter case', () => {
    const unapproved = ['Someone', 'Example.ORG'].join('@');

    expect(findPrivacyIssues(`write to ${APPROVED_EMAIL.toUpperCase()}`)).toEqual([]);
    expect(findPrivacyIssues(`write to ${unapproved}`)).toEqual([unapproved]);
  });

  it('flags an unapproved email and accepts the approved one', () => {
    const unapproved = ['someone', 'example.org'].join('@');

    expect(findPrivacyIssues(`write to ${unapproved}`)).toEqual([unapproved]);
    expect(findPrivacyIssues(`write to ${APPROVED_EMAIL}`)).toEqual([]);
    expect(APPROVED_EMAIL).toBe('seanargieq@gmail.com');
  });

  it('does not flag ordinary text, versions, hashes or dates', () => {
    const ordinary = [
      'Hello world, this is plain text.',
      'next 16.0.1 and react ^19.2.0',
      'sha512-' + 'a1b2c3d4'.repeat(8),
      'commit 4c9bfd8 and 1470048',
      'published 2026-10-26 at 12:30',
      'about 800 px wide, 200 KB, 111 tests',
    ];

    for (const text of ordinary) {
      expect(findPrivacyIssues(text), text).toEqual([]);
    }
  });
});

describe('the project files', () => {
  it('contain no phone-like string and no unapproved email', () => {
    const listing = execFileSync(
      'git',
      ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
      { cwd: projectRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    const paths = listing.split('\0').filter((path) => path !== '');
    const problems: string[] = [];
    let scanned = 0;

    for (const path of paths) {
      if (skippedFiles.has(path) || binaryExtensions.has(extname(path).toLowerCase())) continue;
      let content: Buffer;
      try {
        content = readFileSync(join(projectRoot, path));
      } catch {
        continue;
      }
      if (content.includes(0)) continue;
      scanned += 1;
      for (const match of findPrivacyIssues(content.toString('utf8'))) {
        problems.push(`${path}: ${match}`);
      }
    }

    expect(scanned).toBeGreaterThan(0);
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('still ignore the private folder in .gitignore', () => {
    const gitignore = readFileSync(join(projectRoot, '.gitignore'), 'utf8');

    expect(hasPrivateIgnoreLine(gitignore)).toBe(true);
    expect(hasPrivateIgnoreLine('node_modules\n.next\n')).toBe(false);
  });
});
