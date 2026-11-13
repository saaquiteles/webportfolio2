import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

// Comments are removed so a brace inside one cannot unbalance the matching.
const css = source.replace(/\/\*[^]*?\*\//g, '');

function blockAt(text: string, openBraceIndex: number): string {
  let depth = 0;
  for (let i = openBraceIndex; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}' && --depth === 0) return text.slice(openBraceIndex + 1, i);
  }
  return '';
}

export const mediaStart = css.indexOf('@media (prefers-reduced-motion: no-preference)');
export const motionSafe = mediaStart === -1 ? '' : blockAt(css, css.indexOf('{', mediaStart));
export const outside = mediaStart === -1 ? css : css.replace(motionSafe, '');
