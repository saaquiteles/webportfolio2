import * as runtime from 'react/jsx-runtime';
import type { ReactNode } from 'react';
import type { CaseStudy } from '@/lib/types';

interface MdxContentProps {
  code: CaseStudy['body'];
}

interface MdxModule {
  default: (props: object) => ReactNode;
}

// Velite compiles MDX to a function body string; new Function is its documented way to run it.
// Called directly, not rendered as <Content />: react-hooks/static-components rejects creating a
// component during render, and the generated MDX wrapper has no hooks, so this is safe.
export function MdxContent({ code }: MdxContentProps) {
  const mdx = new Function(code)(runtime) as MdxModule;
  return mdx.default({});
}
