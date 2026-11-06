import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';

type PageModule = {
  default: (props: { params: Promise<Record<string, string>> }) => ReactElement | Promise<ReactElement>;
  generateStaticParams?: () => Record<string, string>[];
};

export const pageLoaders = import.meta.glob<PageModule>('./**/page.tsx');

export async function renderEveryVariant(load: () => Promise<PageModule>) {
  const { default: Page, generateStaticParams } = await load();
  const paramSets = generateStaticParams ? generateStaticParams() : [{}];
  return Promise.all(
    paramSets.map(async (params) => renderToStaticMarkup(await Page({ params: Promise.resolve(params) }))),
  );
}
