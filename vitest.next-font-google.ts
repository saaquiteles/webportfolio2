// Stands in for next/font/google in tests, because the real one downloads the font files.
interface FontOptions {
  variable?: string;
}

function mockFont(family: string) {
  return (options: FontOptions = {}) => ({
    className: `mock-font-${family}`,
    variable: options.variable ?? '',
    style: { fontFamily: family },
  });
}

export const Bricolage_Grotesque = mockFont('bricolage-grotesque');
export const Inter = mockFont('inter');
export const JetBrains_Mono = mockFont('jetbrains-mono');
