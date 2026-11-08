import * as runtime from 'react/jsx-runtime';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { CaseStudy } from '@/lib/types';

interface MdxContentProps {
  code: CaseStudy['body'];
}

type MdxComponents = Record<string, (props: ComponentPropsWithoutRef<never>) => ReactNode>;

interface MdxModule {
  default: (props: { components: MdxComponents }) => ReactNode;
}

const components: MdxComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 {...props} className="mt-12 mb-4 border-t-4 border-tomato pt-3" />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className="my-4 list-disc space-y-2 pl-6" />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol {...props} className="my-4 list-decimal space-y-2 pl-6" />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} className="pl-1" />,
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a {...props} className="text-blueprint underline" />
  ),
};

// Velite compiles MDX to a function body string; new Function is its documented way to run it.
// Called directly, not rendered as <Content />: react-hooks/static-components rejects creating a
// component during render, and the generated MDX wrapper has no hooks, so this is safe.
export function MdxContent({ code }: MdxContentProps) {
  const mdx = new Function(code)(runtime) as MdxModule;
  return <div className="max-w-prose">{mdx.default({ components })}</div>;
}
