// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { outside } from './css-helpers';

describe('the page scroll lock in globals.css', () => {
  it('stops the page scrolling while a dialog is open', () => {
    expect(outside).toMatch(/html:has\(dialog\[open\]\)\s*\{[^}]*overflow:\s*hidden/);
  });

  it('keeps the scrollbar gutter so the page does not jump sideways', () => {
    expect(outside).toMatch(/html\s*\{[^}]*scrollbar-gutter:\s*stable/);
  });
});
