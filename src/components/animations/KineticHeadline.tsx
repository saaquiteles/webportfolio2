import { Fragment, type CSSProperties } from 'react';

interface KineticHeadlineProps {
  text: string;
}

const MAX_DELAY_MS = 400;

function letterStyle(index: number, count: number): CSSProperties {
  return {
    '--kinetic-x': `${((index * 7) % 9) - 4}px`,
    '--kinetic-y': `${((index * 5) % 7) - 3}px`,
    '--kinetic-r': `${((index * 3) % 9) - 4}deg`,
    '--kinetic-delay': `${Math.round((index / Math.max(count - 1, 1)) * MAX_DELAY_MS)}ms`,
  } as CSSProperties;
}

export function KineticHeadline({ text }: KineticHeadlineProps) {
  if (text.length === 0) return null;

  const words = text.split(' ').map((word) => Array.from(word));
  const count = words.reduce((total, letters) => total + letters.length, 0);
  const firstIndexOfWord = words.map((_, wordIndex) =>
    words.slice(0, wordIndex).reduce((total, letters) => total + letters.length, 0),
  );

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((letters, wordIndex) => (
          <Fragment key={wordIndex}>
            <span data-word className="inline-block whitespace-nowrap">
              {letters.map((letter, letterIndex) => {
                const index = firstIndexOfWord[wordIndex] + letterIndex;
                return (
                  <span key={index} data-letter className="inline-block" style={letterStyle(index, count)}>
                    {letter}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}
