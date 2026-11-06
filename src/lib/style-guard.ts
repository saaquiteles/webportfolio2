// A hex colour that is not part of a longer word, a URL fragment or an HTML entity such as &#169;.
const HEX_COLOUR = /(?<![\w&/#-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;

// A utility with a value in square brackets. An arbitrary variant such as aria-[current=page]:
// ends with a colon and holds no design value, so it is allowed.
const ARBITRARY_VALUE = /[\w-]+-\[[^\]\s]+\](?!:)/g;

const ARBITRARY_PROPERTY = /\[[a-z-]+:\S[^\]\s]*\]/g;

const PATTERNS: readonly RegExp[] = [HEX_COLOUR, ARBITRARY_VALUE, ARBITRARY_PROPERTY];

export function findStyleIssues(text: string): string[] {
  return PATTERNS.flatMap((pattern) => Array.from(text.matchAll(pattern), (match) => match[0]));
}
