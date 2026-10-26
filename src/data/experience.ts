import type { Education, Experience, Highlight } from '@/lib/types';

export const experience: Experience[] = [
  {
    role: 'HTD Programmer/Analyst',
    org: 'Vertere Global Solutions',
    start: '2026-06',
    summary:
      "Selected for Vertere's Hire, Train, Deploy (HTD) Program, an intensive training pipeline for early-career professionals. Building server-side applications with Java, Spring Boot and Thymeleaf, RESTful APIs with DTO design patterns, and React front ends, and practising unit testing with JUnit and Mockito. Also training in agentic development: designing, building and integrating AI agents that plan tasks and use tools.",
  },
  {
    role: 'Software Developer Intern',
    org: 'Bridge360',
    start: '2025-05',
    end: '2025-07',
    summary:
      'Built responsive UI components and RESTful backend features for a MERN stack application, with 100% successful integration of email verification and password reset. Unit tested and debugged the code, wrote documentation and presented updates in weekly sprints in an Agile environment.',
  },
];

export const education: Education[] = [
  {
    degree: 'BS Computer Engineering (UNIX Administration specialization)',
    school: 'Mapúa University',
    start: '2018-08',
    end: '2026-01',
  },
];

export const highlights: Highlight[] = [
  {
    title: 'Associate Data Engineer certification',
    org: 'DataCamp',
    date: '2026-08',
  },
  {
    title: 'International Technology Site Visits, Japan',
    org: 'Toyota Technological Institute and Omron Corporation',
    date: '2024-11',
    summary:
      'Site visits in Nagoya, Osaka and Kyoto on automation and sensing technologies, and seminars on robotics and smart manufacturing.',
  },
];
