import { notFound } from 'next/navigation';
import { caseStudies } from '#site/content';
import { MdxContent } from '@/components/sections/MdxContent';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((study) => study.slug === slug);
  if (!caseStudy) notFound();

  return (
    <main>
      <h1>{caseStudy.title}</h1>
      <MdxContent code={caseStudy.body} />
    </main>
  );
}
