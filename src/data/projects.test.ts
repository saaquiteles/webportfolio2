// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { caseStudies } from '#site/content';
import { projects } from './projects';

describe('projects data', () => {
  it('lists the thesis first, then 3D Card Game, then the portfolio', () => {
    expect(projects.map((project) => project.slug)).toEqual([
      'cockatiel-recognition',
      '3d-card-game',
      'portfolio',
    ]);
  });

  it('has a case study for every project, with the same slug, title, summary and tags', () => {
    for (const project of projects) {
      const study = caseStudies.find((candidate) => candidate.slug === project.slug);
      expect(study, `case study for ${project.slug}`).toBeDefined();
      expect(study?.title).toBe(project.title);
      expect(study?.summary).toBe(project.summary);
      expect(study?.tags).toEqual(project.tags);
    }
  });

  it('has a project for every case study, and no duplicate slugs', () => {
    const studySlugs = caseStudies.map((study) => study.slug);
    expect(new Set(studySlugs).size).toBe(studySlugs.length);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    for (const slug of studySlugs) {
      expect(
        projects.some((project) => project.slug === slug),
        `project for ${slug}`,
      ).toBe(true);
    }
  });

  it('uses the year of the case study date', () => {
    for (const project of projects) {
      const study = caseStudies.find((candidate) => candidate.slug === project.slug);
      expect(String(project.year)).toBe(study?.date.slice(0, 4));
    }
  });

  it('links the thesis to its repository and paper and 3D Card Game to its repository', () => {
    expect(projects[0].links?.repo).toBe('https://github.com/saaquiteles/thesis-project');
    expect(projects[0].links?.paper).toBe('https://ebooks.iospress.nl/doi/10.3233/ATDE251126');
    expect(projects[1].links?.repo).toBe('https://github.com/saaquiteles/baccarat');
    expect(projects[2].links?.repo).toBe('https://github.com/saaquiteles/webportfolio2');
  });

  it("keeps the repository and paper links in each case study body the same as the project data", () => {
    for (const project of projects) {
      const study = caseStudies.find((candidate) => candidate.slug === project.slug);
      for (const url of [project.links?.repo, project.links?.paper]) {
        if (url) expect(study?.body, `${url} in the ${project.slug} case study`).toContain(url);
      }
    }
  });

  it('features the thesis, the card game and the portfolio', () => {
    const featured = projects.filter((project) => project.featured).map((project) => project.slug);

    expect(featured).toEqual(['cockatiel-recognition', '3d-card-game', 'portfolio']);
  });
});
