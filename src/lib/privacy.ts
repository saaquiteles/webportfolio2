export const APPROVED_EMAIL = 'seanargieq@gmail.com';

// The first pattern is written as `6[3]` so this file does not match its own pattern.
// Up to two separator characters (space, dot, dash, bracket, slash) may sit between digits.
const PHONE_PATTERNS: readonly RegExp[] = [
  /\+6[3]/g,
  /(?<!\d)09(?:[\s.\-–()/_]{0,2}\d){9}(?!\d)/g,
  /(?<!\d)(?:00)?63[\s.\-–()/_]{0,2}9(?:[\s.\-–()/_]{0,2}\d){9}(?!\d)/g,
];

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;

export function findPrivacyIssues(text: string): string[] {
  const issues: string[] = [];

  for (const pattern of PHONE_PATTERNS) {
    issues.push(...Array.from(text.matchAll(pattern), (match) => match[0]));
  }
  for (const match of text.matchAll(EMAIL_PATTERN)) {
    if (match[0].toLowerCase() !== APPROVED_EMAIL) issues.push(match[0]);
  }

  return issues;
}

export function hasPrivateIgnoreLine(gitignore: string): boolean {
  return gitignore.split(/\r?\n/).some((line) => line.trim() === '/private/');
}
