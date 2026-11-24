import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '#site/content';
import { PageShell } from '@/components/global/PageShell';
import { MdxContent } from '@/components/sections/MdxContent';
import { projects } from '@/data/projects';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((study) => study.slug === slug);
  if (!caseStudy) return {};
  const project = projects.find((item) => item.slug === slug);
  return { title: caseStudy.title, ...(project && { description: project.summary }) };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((study) => study.slug === slug);
  if (!caseStudy) notFound();

  return (
    <PageShell>
      <Link href="/#projects">Back to all projects</Link>
      <h1>{caseStudy.title}</h1>
      <MdxContent code={caseStudy.body} />
    </PageShell>
  );
}
